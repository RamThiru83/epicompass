-- EpiCompass: Supabase schema (run once in the SQL editor).
-- Students sign up with a cohort join code, name, email and password. Progress is stored as one JSON
-- document per student. Students can read and write only their own rows; the instructor can read all.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tables
create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  cohort_id uuid references public.cohorts(id),
  role text not null default 'student' check (role in ('student', 'instructor')),
  consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- helpers
create or replace function public.is_instructor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'instructor');
$$;

-- Lets the sign-up form check a join code before creating an account (returns the cohort name or null).
create or replace function public.check_join_code(code text) returns text
language sql stable security definer set search_path = public as $$
  select name from public.cohorts where upper(join_code) = upper(trim(code)) and active limit 1;
$$;
grant execute on function public.check_join_code(text) to anon, authenticated;

-- Creates the profile when an account is created; rejects sign-ups without a valid, active join code.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare c uuid;
begin
  select id into c from public.cohorts
   where upper(join_code) = upper(trim(coalesce(new.raw_user_meta_data->>'join_code', ''))) and active limit 1;
  if c is null then
    raise exception 'Invalid or inactive join code';
  end if;
  insert into public.profiles (id, full_name, email, cohort_id, consent_at)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), new.email), new.email, c,
          case when (new.raw_user_meta_data->>'consent') = 'true' then now() else null end);
  insert into public.progress (user_id) values (new.id);
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_instructor() from public, anon;
grant execute on function public.is_instructor() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Instructor sets a temporary password for a student who has forgotten theirs (no email service needed).
create or replace function public.instructor_set_password(target uuid, new_password text) returns void
language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if not public.is_instructor() then raise exception 'Not permitted'; end if;
  if length(new_password) < 8 then raise exception 'Password must be at least 8 characters'; end if;
  update auth.users set encrypted_password = crypt(new_password, gen_salt('bf')), updated_at = now() where id = target;
end $$;
revoke execute on function public.instructor_set_password(uuid, text) from public, anon;
grant execute on function public.instructor_set_password(uuid, text) to authenticated;

-- ---------------------------------------------------------------- row-level security
alter table public.cohorts enable row level security;
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "cohorts: instructor all" on public.cohorts;
create policy "cohorts: instructor all" on public.cohorts for all to authenticated
  using (public.is_instructor()) with check (public.is_instructor());
drop policy if exists "cohorts: members read own" on public.cohorts;
create policy "cohorts: members read own" on public.cohorts for select to authenticated
  using (id = (select cohort_id from public.profiles where id = auth.uid()));

drop policy if exists "profiles: read own or instructor" on public.profiles;
create policy "profiles: read own or instructor" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_instructor());
drop policy if exists "profiles: update own name" on public.profiles;
create policy "profiles: update own name" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "progress: read own or instructor" on public.progress;
create policy "progress: read own or instructor" on public.progress for select to authenticated
  using (user_id = auth.uid() or public.is_instructor());
drop policy if exists "progress: write own" on public.progress;
create policy "progress: write own" on public.progress for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "progress: update own" on public.progress;
create policy "progress: update own" on public.progress for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------- first cohort
insert into public.cohorts (name, join_code)
values ('MSc Clinical Research 2026-27', 'EPI-2026')
on conflict (join_code) do nothing;

-- After the instructor signs up through the app with the join code, run once:
--   update public.profiles set role = 'instructor' where email = 'ramachandran@thsti.res.in';
