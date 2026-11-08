-- Students whose course code does not include Kenny can unlock Kenny on the course account by entering the
-- code of a course that does, the first time they open Kenny. Guessing is limited to 10 tries a day.
create table if not exists public.kenny_access (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  cohort_id  uuid not null references public.cohorts(id) on delete cascade,
  granted_at timestamptz not null default now()
);
alter table public.kenny_access enable row level security;
drop policy if exists "kenny access: read own or instructor" on public.kenny_access;
create policy "kenny access: read own or instructor" on public.kenny_access for select to authenticated
  using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "kenny access: instructor delete" on public.kenny_access;
create policy "kenny access: instructor delete" on public.kenny_access for delete to authenticated
  using (public.is_instructor());

create table if not exists public.kenny_code_tries (
  user_id uuid not null references auth.users(id) on delete cascade,
  day     date not null,
  tries   int not null default 0,
  primary key (user_id, day)
);
alter table public.kenny_code_tries enable row level security;   -- no policies: functions only

-- Enter a course code for Kenny. Returns the course name if accepted, null if not; raises after 10 tries a day.
create or replace function public.kenny_redeem(code text) returns text
language plpgsql security definer set search_path = public as $$
declare c record; n int;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  insert into kenny_code_tries (user_id, day, tries) values (auth.uid(), kenny_today(), 1)
    on conflict (user_id, day) do update set tries = kenny_code_tries.tries + 1 returning tries into n;
  if n > 10 then raise exception 'Too many tries today'; end if;
  select id, name into c from cohorts
   where upper(regexp_replace(join_code, '\s', '', 'g')) = upper(regexp_replace(coalesce(code, ''), '\s', '', 'g'))
     and active and kenny limit 1;
  if c.id is null then return null; end if;
  insert into kenny_access (user_id, cohort_id) values (auth.uid(), c.id)
    on conflict (user_id) do update set cohort_id = excluded.cohort_id, granted_at = now();
  return c.name;
end $$;
revoke all on function public.kenny_redeem(text) from public, anon;
grant execute on function public.kenny_redeem(text) to authenticated;

-- Eligible: instructors; students whose own course code includes Kenny; students who entered such a code.
create or replace function public.kenny_eligible(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p left join public.cohorts c on c.id = p.cohort_id
     where p.id = uid and (p.role = 'instructor' or coalesce(c.kenny, false)))
  or exists (
    select 1 from public.kenny_access a join public.cohorts c on c.id = a.cohort_id
     where a.user_id = uid and c.kenny)
$$;
revoke all on function public.kenny_eligible(uuid) from public, anon, authenticated;
grant execute on function public.kenny_eligible(uuid) to service_role;
