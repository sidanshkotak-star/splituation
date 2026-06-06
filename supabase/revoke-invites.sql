-- Run this in Supabase SQL Editor to tighten invite updates.
-- Group members can revoke pending invites; invited users still accept via accept_group_invite().

drop policy if exists "group_invites_update_group_member_or_invitee" on public.group_invites;
drop policy if exists "group_invites_update_group_member" on public.group_invites;

create policy "group_invites_update_group_member"
on public.group_invites
for update
to authenticated
using (public.is_group_member(group_id, auth.uid()))
with check (public.is_group_member(group_id, auth.uid()));

notify pgrst, 'reload schema';
