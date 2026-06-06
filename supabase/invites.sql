-- Run this in Supabase SQL Editor to enable invite acceptance
-- and let invitees see who invited them.

create or replace function public.accept_group_invite(invite_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_row public.group_invites%rowtype;
  current_email text;
begin
  if auth.uid() is null then
    raise exception 'You must be logged in to accept an invite.';
  end if;

  current_email := lower(auth.jwt() ->> 'email');

  select *
  into invite_row
  from public.group_invites
  where id = invite_id
    and status = 'pending'
    and expires_at > now()
    and lower(invited_email) = current_email
  for update;

  if not found then
    raise exception 'Invite not found, expired, or sent to a different email.';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (invite_row.group_id, auth.uid(), 'member')
  on conflict (group_id, user_id) do nothing;

  update public.group_invites
  set status = 'accepted',
      accepted_at = now()
  where id = invite_row.id;

  return invite_row.group_id;
end;
$$;

grant execute on function public.accept_group_invite(uuid) to authenticated;

drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.shares_group(auth.uid(), id)
  or exists (
    select 1
    from public.group_invites
    where invited_by = profiles.id
      and status = 'pending'
      and lower(invited_email) = lower(auth.jwt() ->> 'email')
  )
);

notify pgrst, 'reload schema';

drop policy if exists "group_invites_update_group_member_or_invitee" on public.group_invites;
drop policy if exists "group_invites_update_group_member" on public.group_invites;
create policy "group_invites_update_group_member"
on public.group_invites
for update
to authenticated
using (public.is_group_member(group_id, auth.uid()))
with check (public.is_group_member(group_id, auth.uid()));

notify pgrst, 'reload schema';
