-- Run this in Supabase SQL Editor to enable custom payer percentages.
-- Existing expenses are backfilled as 100% paid by their current paid_by user.

create table if not exists public.expense_payers (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  percent numeric(5, 2) not null check (percent > 0 and percent <= 100),
  created_at timestamptz not null default now(),
  unique (expense_id, user_id)
);

create index if not exists expense_payers_expense_id_idx on public.expense_payers(expense_id);
create index if not exists expense_payers_user_id_idx on public.expense_payers(user_id);

insert into public.expense_payers (expense_id, user_id, percent)
select id, paid_by, 100
from public.expenses
on conflict (expense_id, user_id) do nothing;

create or replace function public.is_expense_group_member(check_expense_id uuid, check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.expenses
    where id = check_expense_id
      and public.is_group_member(group_id, check_user_id)
  );
$$;

create or replace function public.can_manage_expense_payers(check_expense_id uuid, check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.expenses
    where id = check_expense_id
      and (
        created_by = check_user_id
        or public.is_group_owner(group_id, check_user_id)
      )
  );
$$;

alter table public.expense_payers enable row level security;

drop policy if exists "expense_payers_select_group_member" on public.expense_payers;
create policy "expense_payers_select_group_member"
on public.expense_payers
for select
to authenticated
using (public.is_expense_group_member(expense_id, auth.uid()));

drop policy if exists "expense_payers_insert_expense_manager" on public.expense_payers;
create policy "expense_payers_insert_expense_manager"
on public.expense_payers
for insert
to authenticated
with check (
  public.can_manage_expense_payers(expense_id, auth.uid())
  and public.is_expense_group_member(expense_id, user_id)
);

drop policy if exists "expense_payers_update_expense_manager" on public.expense_payers;
create policy "expense_payers_update_expense_manager"
on public.expense_payers
for update
to authenticated
using (public.can_manage_expense_payers(expense_id, auth.uid()))
with check (
  public.can_manage_expense_payers(expense_id, auth.uid())
  and public.is_expense_group_member(expense_id, user_id)
);

drop policy if exists "expense_payers_delete_expense_manager" on public.expense_payers;
create policy "expense_payers_delete_expense_manager"
on public.expense_payers
for delete
to authenticated
using (public.can_manage_expense_payers(expense_id, auth.uid()));

notify pgrst, 'reload schema';
