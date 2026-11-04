-- Kenny on the course's Claude API credit.
-- Students' questions go through the Edge Function "kenny" (supabase/functions/kenny), which holds the
-- Anthropic API key as a secret. This table records only how many questions each student asked per day and
-- what they cost, so that daily limits and the monthly budget can be enforced. What students type and what
-- Kenny replies are never stored.

create table if not exists public.kenny_usage (
  user_id   uuid not null references auth.users(id) on delete cascade,
  day       date not null,
  questions int not null default 0,
  cost_usd  numeric(12, 6) not null default 0,
  primary key (user_id, day)
);
create index if not exists kenny_usage_day on public.kenny_usage (day);

alter table public.kenny_usage enable row level security;
drop policy if exists "kenny usage: read own or instructor" on public.kenny_usage;
create policy "kenny usage: read own or instructor" on public.kenny_usage for select to authenticated
  using (user_id = auth.uid() or public.is_instructor());
-- no insert/update/delete policies: only the Edge Function (secret key) writes

-- today's date in India, so the daily allowance resets at midnight IST
create or replace function public.kenny_today() returns date
language sql stable as $$ select (now() at time zone 'Asia/Kolkata')::date $$;

-- Reserve one question for a student. Returns the questions left today after this one, or
-- -1 if the student's daily limit is reached, -2 if the course's monthly budget is used up.
create or replace function public.kenny_reserve(uid uuid, daily_limit int, monthly_budget numeric) returns int
language plpgsql security definer set search_path = public as $$
declare used int; spent numeric;
begin
  select coalesce(sum(cost_usd), 0) into spent from kenny_usage
    where day >= date_trunc('month', kenny_today())::date;
  if spent >= monthly_budget then return -2; end if;
  insert into kenny_usage (user_id, day, questions) values (uid, kenny_today(), 0)
    on conflict (user_id, day) do nothing;
  select questions into used from kenny_usage where user_id = uid and day = kenny_today() for update;
  if used >= daily_limit then return -1; end if;
  update kenny_usage set questions = questions + 1 where user_id = uid and day = kenny_today();
  return daily_limit - used - 1;
end $$;

-- Record what a question cost, or give the question back if it failed.
create or replace function public.kenny_settle(uid uuid, cost numeric, refund boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  update kenny_usage
     set cost_usd = cost_usd + greatest(cost, 0),
         questions = greatest(questions - case when refund then 1 else 0 end, 0)
   where user_id = uid and day = kenny_today();
end $$;

-- How many questions the signed-in student has left today (for the counter in the chat).
create or replace function public.kenny_left(daily_limit int) returns int
language sql security definer set search_path = public stable as $$
  select greatest(daily_limit - coalesce((select questions from kenny_usage where user_id = auth.uid() and day = kenny_today()), 0), 0)
$$;

-- Instructor summary for this month.
create or replace function public.kenny_month_summary() returns table (questions bigint, students bigint, cost_usd numeric)
language plpgsql security definer set search_path = public stable as $$
begin
  if not public.is_instructor() then raise exception 'Not permitted'; end if;
  return query select coalesce(sum(k.questions), 0)::bigint, count(distinct k.user_id) filter (where k.questions > 0), coalesce(sum(k.cost_usd), 0)
    from kenny_usage k where k.day >= date_trunc('month', kenny_today())::date;
end $$;

revoke all on function public.kenny_reserve(uuid, int, numeric) from public, anon, authenticated;
revoke all on function public.kenny_settle(uuid, numeric, boolean) from public, anon, authenticated;
grant execute on function public.kenny_reserve(uuid, int, numeric) to service_role;
grant execute on function public.kenny_settle(uuid, numeric, boolean) to service_role;
revoke all on function public.kenny_left(int) from public, anon;
grant execute on function public.kenny_left(int) to authenticated;
revoke all on function public.kenny_month_summary() from public, anon;
grant execute on function public.kenny_month_summary() to authenticated;
