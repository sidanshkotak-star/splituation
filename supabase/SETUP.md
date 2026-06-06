# Supabase Setup

This folder contains the starter database setup for Splituation.

## What You Do In Supabase

1. Go to https://supabase.com and create a new project.
2. Open the project dashboard.
3. Go to **SQL Editor**.
4. Open `schema.sql` from this folder.
5. Paste the full contents into the SQL Editor.
6. Click **Run**.

## What The Schema Creates

- `profiles`
- `groups`
- `group_members`
- `expenses`
- `group_invites`
- `group_settlements`

It also turns on Row Level Security so users can only access groups, members, expenses, and invites they are allowed to see.

## What We Do Next In The App

After the schema runs successfully, we will connect the app to Supabase Auth and replace the temporary browser storage with real database reads and writes.

## Invite Acceptance

After running `schema.sql`, also run `invites.sql` in the Supabase SQL Editor. It creates the secure function the app uses when an invited user accepts a group invite.

## Settle Up

After running `schema.sql`, also run `settlements.sql` in the Supabase SQL Editor. It creates the settlement records the app uses when someone clicks **I've been paid**.

## Email Confirmation Redirects

If confirmation emails open `localhost`, update this in Supabase:

1. Go to **Authentication**.
2. Open **URL Configuration**.
3. Set **Site URL** to the real app URL users should return to after confirming email.
4. Add the same URL under **Redirect URLs** if Supabase asks for allowed redirect URLs.

For a phone or another person's device, `localhost` will not work. Use the deployed app URL once the app is on Vercel or another host.
