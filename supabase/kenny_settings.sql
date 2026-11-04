-- Instructor's central controls for Kenny on the course account: an on/off switch for everyone, the daily
-- question limit per student, and the monthly budget. One row; only the instructor can change it.
create table if not exists public.kenny_settings (
  id             int primary key default 1 check (id = 1),
  enabled        boolean not null default true,
  daily_limit    int not null default 150 check (daily_limit between 1 and 1000),
  monthly_budget numeric(8, 2) not null default 450 check (monthly_budget between 0 and 500),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users(id) on delete set null
);
insert into public.kenny_settings (id) values (1) on conflict (id) do nothing;

alter table public.kenny_settings enable row level security;
drop policy if exists "kenny settings: read" on public.kenny_settings;
create policy "kenny settings: read" on public.kenny_settings for select to authenticated using (true);
drop policy if exists "kenny settings: instructor update" on public.kenny_settings;
create policy "kenny settings: instructor update" on public.kenny_settings for update to authenticated
  using (public.is_instructor()) with check (public.is_instructor());

create or replace function public.kenny_settings_stamp() returns trigger
language plpgsql security definer set search_path = public as $$
begin new.updated_at := now(); new.updated_by := auth.uid(); new.id := 1; return new; end $$;
drop trigger if exists kenny_settings_stamp on public.kenny_settings;
create trigger kenny_settings_stamp before update on public.kenny_settings
  for each row execute function public.kenny_settings_stamp();
revoke all on function public.kenny_settings_stamp() from public, anon, authenticated;
