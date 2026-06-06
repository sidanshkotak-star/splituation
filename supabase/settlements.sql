-- Run this in Supabase SQL Editor to enable Settle Up.
-- It keeps expenses intact and records payments separately.

create table if not exists public.group_settlements (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  created_by uuid not null references auth.users(id) on delete cascade,
  settled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (from_user <> to_user)
);

create index if not exists group_settlements_group_id_idx on public.group_settlements(group_id);
create index if not exists group_settlements_from_user_idx on public.group_settlements(from_user);
create index if not exists group_settlements_to_user_idx on public.group_settlements(to_user);

alter table public.group_settlements enable row level security;

drop policy if exists "group_settlements_select_group_member" on public.group_settlements;
create policy "group_settlements_select_group_member"
on public.group_settlements
for select
to authenticated
using (public.is_group_member(group_id, auth.uid()));

drop policy if exists "group_settlements_insert_paid_to_user" on public.group_settlements;
create policy "group_settlements_insert_paid_to_user"
on public.group_settlements
for insert
to authenticated
with check (
  created_by = auth.uid()
  and to_user = auth.uid()
  and public.is_group_member(group_id, auth.uid())
  and public.is_group_member(group_id, from_user)
  and public.is_group_member(group_id, to_user)
);

notify pgrst, 'reload schema';
