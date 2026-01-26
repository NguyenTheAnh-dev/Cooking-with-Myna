create table public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique, -- e.g., MYNA123
  host_id uuid references public.profiles(id),
  status text check (status in ('idle', 'lobby', 'playing', 'finished')) default 'idle',
  max_players int default 4,
  created_at timestamptz default now()
);

-- Realtime
alter table public.game_rooms replica identity full;

-- RLS
alter table public.game_rooms enable row level security;

create policy "Game rooms are viewable by everyone."
  on public.game_rooms for select
  using ( true );

create policy "Authenticated users can create rooms."
  on public.game_rooms for insert
  to authenticated
  with check ( true );

create policy "Host can update room."
  on public.game_rooms for update
  using ( auth.uid() = host_id );

-- Indexes
create index game_rooms_code_idx on public.game_rooms (code);
create index game_rooms_host_id_idx on public.game_rooms (host_id);
create index game_rooms_status_idx on public.game_rooms (status);
