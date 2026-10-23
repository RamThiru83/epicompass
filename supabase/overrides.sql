-- EpiCompass: inline edits of course text, published by the instructor to all learners.
-- One row per edited block of markdown. key = '<scope>:<block index>', e.g. 'card.ch04-risk.formalise:2'.
-- base_hash is the hash of the original block; if the underlying course text later changes, the edit is
-- treated as outdated and ignored until it is reverted or re-edited. Everyone can read; only the instructor writes.

create table if not exists public.epi_overrides (
  key text primary key check (key ~ '^[a-z0-9_.-]{1,120}:[0-9]{1,4}$'),
  md text not null check (length(md) between 1 and 20000),
  base_hash text not null check (length(base_hash) < 32),
  updated_by uuid default auth.uid() references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
create index if not exists epi_overrides_updated_by_idx on public.epi_overrides(updated_by);
alter table public.epi_overrides enable row level security;

drop policy if exists "epi_overrides read" on public.epi_overrides;
create policy "epi_overrides read" on public.epi_overrides for select to anon, authenticated using (true);
drop policy if exists "epi_overrides ins" on public.epi_overrides;
create policy "epi_overrides ins" on public.epi_overrides for insert to authenticated with check ((select public.is_instructor()));
drop policy if exists "epi_overrides upd" on public.epi_overrides;
create policy "epi_overrides upd" on public.epi_overrides for update to authenticated using ((select public.is_instructor())) with check ((select public.is_instructor()));
drop policy if exists "epi_overrides del" on public.epi_overrides;
create policy "epi_overrides del" on public.epi_overrides for delete to authenticated using ((select public.is_instructor()));
