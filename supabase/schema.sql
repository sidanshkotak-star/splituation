-- Splituation starter Supabase schema
-- Run this in the Supabase SQL editor after creating a new Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  paid_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  category text not null check (
    category in (
      'Food',
      'Groceries',
      'Transport',
      'Housing',
      'Entertainment',
      'Travel',
      'Shopping',
      'Other'
    )
  ),
  expense_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  invited_email text not null,
  invited_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  token uuid not null default gen_random_uuid(),
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (group_id, invited_email, status)
);

create index if not exists group_members_group_id_idx on public.group_members(group_id);
create index if not exists group_members_user_id_idx on public.group_members(user_id);
create index if not exists expenses_group_id_idx on public.expenses(group_id);
create index if not exists expenses_expense_date_idx on public.expenses(expense_date);
create index if not exists group_invites_token_idx on public.group_invites(token);
create index if not exists group_invites_invited_email_idx on public.group_invites(invited_email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists groups_set_updated_at on public.groups;
create trigger groups_set_updated_at
before update on public.groups
for each row execute function public.set_updated_at();

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

create or replace function public.is_group_member(check_group_id uuid, check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members
    where group_id = check_group_id
      and user_id = check_user_id
  );
$$;

create or replace function public.is_group_owner(check_group_id uuid, check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members
    where group_id = check_group_id
      and user_id = check_user_id
      and role = 'owner'
  );
$$;

create or replace function public.is_group_creator(check_group_id uuid, check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.groups
    where id = check_group_id
      and created_by = check_user_id
  );
$$;

create or replace function public.shares_group(first_user_id uuid, second_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members first_member
    join public.group_members second_member
      on second_member.group_id = first_member.group_id
    where first_member.user_id = first_user_id
      and second_member.user_id = second_user_id
  );
$$;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.expenses enable row level security;
alter table public.group_invites enable row level security;

drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.shares_group(auth.uid(), id)
);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "groups_select_member" on public.groups;
create policy "groups_select_member"
on public.groups
for select
to authenticated
using (
  created_by = auth.uid()
  or public.is_group_member(id, auth.uid())
);

drop policy if exists "groups_insert_own" on public.groups;
create policy "groups_insert_own"
on public.groups
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "groups_update_owner" on public.groups;
create policy "groups_update_owner"
on public.groups
for update
to authenticated
using (public.is_group_owner(id, auth.uid()))
with check (public.is_group_owner(id, auth.uid()));

drop policy if exists "groups_delete_owner" on public.groups;
create policy "groups_delete_owner"
on public.groups
for delete
to authenticated
using (public.is_group_owner(id, auth.uid()));

drop policy if exists "group_members_select_group_member" on public.group_members;
create policy "group_members_select_group_member"
on public.group_members
for select
to authenticated
using (public.is_group_member(group_id, auth.uid()));

drop policy if exists "group_members_insert_self_owner" on public.group_members;
create policy "group_members_insert_self_owner"
on public.group_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and public.is_group_creator(group_id, auth.uid())
);

drop policy if exists "group_members_insert_owner" on public.group_members;
create policy "group_members_insert_owner"
on public.group_members
for insert
to authenticated
with check (public.is_group_owner(group_id, auth.uid()));

drop policy if exists "group_members_delete_owner" on public.group_members;
create policy "group_members_delete_owner"
on public.group_members
for delete
to authenticated
using (public.is_group_owner(group_id, auth.uid()));

drop policy if exists "expenses_select_group_member" on public.expenses;
create policy "expenses_select_group_member"
on public.expenses
for select
to authenticated
using (public.is_group_member(group_id, auth.uid()));

drop policy if exists "expenses_insert_group_member" on public.expenses;
create policy "expenses_insert_group_member"
on public.expenses
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.is_group_member(group_id, auth.uid())
  and public.is_group_member(group_id, paid_by)
);

drop policy if exists "expenses_update_creator_or_owner" on public.expenses;
create policy "expenses_update_creator_or_owner"
on public.expenses
for update
to authenticated
using (
  created_by = auth.uid()
  or public.is_group_owner(group_id, auth.uid())
)
with check (
  public.is_group_member(group_id, auth.uid())
  and public.is_group_member(group_id, paid_by)
);

drop policy if exists "expenses_delete_creator_or_owner" on public.expenses;
create policy "expenses_delete_creator_or_owner"
on public.expenses
for delete
to authenticated
using (
  created_by = auth.uid()
  or public.is_group_owner(group_id, auth.uid())
);

drop policy if exists "group_invites_select_group_member_or_invitee" on public.group_invites;
create policy "group_invites_select_group_member_or_invitee"
on public.group_invites
for select
to authenticated
using (
  public.is_group_member(group_id, auth.uid())
  or lower(invited_email) = lower(auth.jwt() ->> 'email')
);

drop policy if exists "group_invites_insert_group_member" on public.group_invites;
create policy "group_invites_insert_group_member"
on public.group_invites
for insert
to authenticated
with check (
  invited_by = auth.uid()
  and public.is_group_member(group_id, auth.uid())
);

drop policy if exists "group_invites_update_group_member_or_invitee" on public.group_invites;
create policy "group_invites_update_group_member_or_invitee"
on public.group_invites
for update
to authenticated
using (
  public.is_group_member(group_id, auth.uid())
  or lower(invited_email) = lower(auth.jwt() ->> 'email')
)
with check (
  public.is_group_member(group_id, auth.uid())
  or lower(invited_email) = lower(auth.jwt() ->> 'email')
);
