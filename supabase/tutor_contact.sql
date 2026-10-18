-- EpiCompass: instructor's WhatsApp contact for the "Message your instructor" button.
-- The number is never in the public code. It is stored here, written only by the instructor,
-- and returned only to signed-in students who joined a cohort (and the instructor).

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;

drop policy if exists "app_settings: instructor all" on public.app_settings;
create policy "app_settings: instructor all" on public.app_settings for all to authenticated
  using (public.is_instructor()) with check (public.is_instructor());

create or replace function public.tutor_contact() returns text
language sql stable security definer set search_path = public as $$
  select s.value from public.app_settings s
   where s.key = 'whatsapp'
     and (public.is_instructor() or exists (
           select 1 from public.profiles p where p.id = auth.uid() and p.cohort_id is not null));
$$;
revoke execute on function public.tutor_contact() from public, anon;
grant execute on function public.tutor_contact() to authenticated;
