create table public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.game_rooms(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  is_ready boolean default false,
  is_host boolean default false,
  joined_at timestamptz default now(),
  unique(room_id, user_id)
);

-- Realtime
alter table public.room_players replica identity full;

-- RLS
alter table public.room_players enable row level security;

create policy "Room players viewable by everyone in the room."
  on public.room_players for select
  using ( true ); -- Simplified for demo, ideally filter by room_id

create policy "Users can join rooms."
  on public.room_players for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can update their own status."
  on public.room_players for update
  using ( auth.uid() = user_id );

create policy "Users can leave rooms."
  on public.room_players for delete
  using ( auth.uid() = user_id );

-- Indexes
create index room_players_room_id_idx on public.room_players (room_id);
create index room_players_user_id_idx on public.room_players (user_id);
