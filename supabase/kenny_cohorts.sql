-- Kenny on the course account only for students who joined with an enabled course code (cohort).
-- The instructor switches each cohort on or off in the Class dashboard; instructors can always use Kenny.
alter table public.cohorts add column if not exists kenny boolean not null default false;
update public.cohorts set kenny = true where name in ('MSc Clinical Research 2026-27', 'Young investigators 2026-27');

create or replace function public.kenny_eligible(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p left join public.cohorts c on c.id = p.cohort_id
     where p.id = uid and (p.role = 'instructor' or coalesce(c.kenny, false)))
$$;
revoke all on function public.kenny_eligible(uuid) from public, anon, authenticated;
grant execute on function public.kenny_eligible(uuid) to service_role;
