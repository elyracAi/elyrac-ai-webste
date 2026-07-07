-- Run this once in the Supabase SQL Editor for project ucbyaknfjrtoitrzamca
-- (Dashboard → SQL Editor → New query → paste → Run)
-- Creates the table the Maya chat widget logs every message to, and lets the
-- admin dashboard read/subscribe to it the same way it already does for
-- contact_submissions.

create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  session_id text not null,
  sender text not null check (sender in ('user', 'bot')),
  message text not null,
  page text,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_id_idx on public.chat_messages (session_id);
create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at);

alter table public.chat_messages enable row level security;

-- The public chat widget (anon key, no login) needs to be able to insert messages
create policy "Allow anon insert" on public.chat_messages
  for insert
  to anon
  with check (true);

-- Only logged-in team members (Team Portal) can read conversations
create policy "Allow authenticated read" on public.chat_messages
  for select
  to authenticated
  using (true);

-- Only logged-in team members can delete conversations (from the admin dashboard)
create policy "Allow authenticated delete" on public.chat_messages
  for delete
  to authenticated
  using (true);

-- Lets the admin dashboard get live updates when a new chat message comes in,
-- the same way it already does for contact_submissions
alter publication supabase_realtime add table public.chat_messages;
