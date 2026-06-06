-- Run this once in Supabase SQL Editor to enable safe invite acceptance.

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
