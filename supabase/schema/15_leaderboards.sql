create table public.leaderboards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,

  total_matches int default 0,
  total_wins int default 0,
  total_score int default 0,
  best_score int default 0,

  rank int,
  last_updated timestamptz default now(),

  unique(user_id)
);

-- RLS
alter table public.leaderboards enable row level security;

create policy "Leaderboards viewable by everyone."
  on public.leaderboards for select
  using ( true );

-- Indexes
create index leaderboards_total_wins_idx on public.leaderboards (total_wins desc);
create index leaderboards_total_score_idx on public.leaderboards (total_score desc);
