create table public.player_actions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(id) on delete cascade,
  user_id uuid references public.profiles(id),
  action_type text, -- chop, cook, serve, burn, pickup...
  payload jsonb,
  created_at timestamptz default now()
);

-- Realtime
alter table public.player_actions replica identity full;

-- RLS
alter table public.player_actions enable row level security;

create policy "Actions viewable by everyone in session."
  on public.player_actions for select
  using ( true );

create policy "Players can log their own actions."
  on public.player_actions for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Indexes
create index player_actions_session_id_idx on public.player_actions (session_id);
create index player_actions_created_at_idx on public.player_actions (created_at);
