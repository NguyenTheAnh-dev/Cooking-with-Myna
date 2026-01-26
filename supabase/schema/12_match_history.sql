create table public.match_history (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(id) on delete set null,
  room_id uuid references public.game_rooms(id) on delete set null,

  started_at timestamptz,
  ended_at timestamptz,

  total_players int,
  winner_id uuid references public.profiles(id),

  summary jsonb, 
  -- e.g., { "orders_completed": 5, "failed": 1, "duration": 320 }

  created_at timestamptz default now()
);

-- RLS
alter table public.match_history enable row level security;

create policy "History is viewable by everyone."
  on public.match_history for select
  using ( true );

-- Indexes
create index match_history_winner_id_idx on public.match_history (winner_id);
create index match_history_created_at_idx on public.match_history (created_at);
