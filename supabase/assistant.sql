-- Study assistant insights (opt-in).
-- Students may consent to EpiCompass recording WHICH card, step and passage of course text they asked the
-- study assistant about. The question they type and the assistant's reply are never stored; nor is the
-- student's OpenRouter key, which stays in their browser. Only the instructor can read the records.

alter table public.profiles add column if not exists insights_consent_at timestamptz;

create table if not exists public.assistant_asks (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cohort_id  uuid references public.cohorts(id) on delete set null,
  card_id    text not null check (char_length(card_id) <= 80),
  step       text check (char_length(step) <= 20),
  action     text not null check (action in ('explain', 'example', 'why', 'quiz', 'question')),
  excerpt    text check (char_length(excerpt) <= 400),   -- the course passage selected, if any
  created_at timestamptz not null default now()
);
create index if not exists assistant_asks_card on public.assistant_asks (card_id);
create index if not exists assistant_asks_cohort on public.assistant_asks (cohort_id, created_at);

-- cohort is taken from the student's profile, never from the client
create or replace function public.assistant_asks_fill() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  select cohort_id into new.cohort_id from public.profiles where id = auth.uid();
  new.created_at := now();
  return new;
end $$;
drop trigger if exists assistant_asks_fill on public.assistant_asks;
create trigger assistant_asks_fill before insert on public.assistant_asks
  for each row execute function public.assistant_asks_fill();

alter table public.assistant_asks enable row level security;
drop policy if exists "asks: insert own with consent" on public.assistant_asks;
create policy "asks: insert own with consent" on public.assistant_asks for insert to authenticated
  with check (user_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.insights_consent_at is not null));
drop policy if exists "asks: instructor read" on public.assistant_asks;
create policy "asks: instructor read" on public.assistant_asks for select to authenticated using (public.is_instructor());
drop policy if exists "asks: instructor delete" on public.assistant_asks;
create policy "asks: instructor delete" on public.assistant_asks for delete to authenticated using (public.is_instructor());

-- withdrawing consent removes the student's records
create or replace function public.withdraw_insights_consent() returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set insights_consent_at = null where id = auth.uid();
  delete from public.assistant_asks where user_id = auth.uid();
end $$;
revoke all on function public.withdraw_insights_consent() from public, anon;
grant execute on function public.withdraw_insights_consent() to authenticated;
revoke all on function public.assistant_asks_fill() from public, anon, authenticated;
