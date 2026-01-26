create table public.session_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(id) on delete cascade,
  user_id uuid references public.profiles(id),
  character_id uuid references public.characters(id),
  score int default 0,
  progress jsonb default '{}',
  unique(session_id, user_id)
);

-- Realtime
alter table public.session_players replica identity full;

-- RLS
alter table public.session_players enable row level security;

create policy "Session players viewable by everyone."
  on public.session_players for select
  using ( true );

create policy "System/Host can insert session players."
  on public.session_players for insert
  to authenticated
  with check ( true ); -- Ideally tighter control via Edge Functions

create policy "Players can update their own progress."
  on public.session_players for update
  using ( auth.uid() = user_id );

-- Indexes
create index session_players_session_id_idx on public.session_players (session_id);
create index session_players_user_id_idx on public.session_players (user_id);
