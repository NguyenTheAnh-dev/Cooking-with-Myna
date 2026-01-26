create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.game_rooms(id) on delete cascade,
  status text check (status in ('waiting', 'playing', 'ended')) default 'waiting',
  current_phase text, -- prepare / cooking / result
  started_at timestamptz,
  ended_at timestamptz
);

-- Realtime
alter table public.game_sessions replica identity full;

-- RLS
alter table public.game_sessions enable row level security;

create policy "Sessions viewable by everyone."
  on public.game_sessions for select
  using ( true );

create policy "Hosts can create sessions for their rooms."
  on public.game_sessions for insert
  to authenticated
  with check (
    exists (
      select 1 from public.game_rooms
      where id = room_id and host_id = auth.uid()
    )
  );

create policy "Hosts can update sessions."
  on public.game_sessions for update
  using (
    exists (
      select 1 from public.game_rooms
      where id = room_id and host_id = auth.uid()
    )
  );

-- Indexes
create index game_sessions_room_id_idx on public.game_sessions (room_id);
create index game_sessions_status_idx on public.game_sessions (status);
