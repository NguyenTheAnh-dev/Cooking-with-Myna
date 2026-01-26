create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Indexes
create index profiles_username_idx on public.profiles (username);
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
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,     -- MYNA_01, CHEF_DUCK_02...
  name text not null,            -- Myna, Duck, Cat Chef...
  image_url text not null,       -- sprite / png / webp
  created_at timestamptz default now()
);

-- RLS
alter table public.characters enable row level security;

create policy "Characters are viewable by everyone."
  on public.characters for select
  using ( true );
-- No insert/update policy for regular users (admin only via dashboard/seed)

-- Indexes
create index characters_code_idx on public.characters (code);
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
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  difficulty text check (difficulty in ('easy', 'normal', 'hard')),
  created_at timestamptz default now()
);

-- RLS
alter table public.recipes enable row level security;

create policy "Recipes are viewable by everyone."
  on public.recipes for select
  using ( true );

-- Indexes
create index recipes_difficulty_idx on public.recipes (difficulty);
create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text
);

-- RLS
alter table public.ingredients enable row level security;

create policy "Ingredients are viewable by everyone."
  on public.ingredients for select
  using ( true );

-- Indexes
create index ingredients_name_idx on public.ingredients (name);
create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references public.recipes(id) on delete cascade,
  ingredient_id uuid references public.ingredients(id) on delete cascade,
  amount int default 1
);

-- RLS
alter table public.recipe_ingredients enable row level security;

create policy "Recipe ingredients are viewable by everyone."
  on public.recipe_ingredients for select
  using ( true );

-- Indexes
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients (recipe_id);
create index recipe_ingredients_ingredient_id_idx on public.recipe_ingredients (ingredient_id);
create table public.session_orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(id) on delete cascade,
  recipe_id uuid references public.recipes(id),
  status text check (status in ('pending', 'cooking', 'done', 'failed')) default 'pending',
  created_at timestamptz default now()
);

-- Realtime
alter table public.session_orders replica identity full;

-- RLS
alter table public.session_orders enable row level security;

create policy "Session orders viewable by everyone."
  on public.session_orders for select
  using ( true );

create policy "Players can update orders (e.g. complete them)."
  on public.session_orders for update
  to authenticated
  using (
    exists (
      select 1 from public.session_players
      where session_id = session_orders.session_id
      and user_id = auth.uid()
    )
  );

-- Indexes
create index session_orders_session_id_idx on public.session_orders (session_id);
create index session_orders_status_idx on public.session_orders (status);
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
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text unique not null, -- FAST_COOKER, NO_BURN, MVP...
  name text not null,
  description text,
  icon_url text,
  condition jsonb, 
  -- e.g., { "orders_completed": 10, "burned": 0 }

  created_at timestamptz default now()
);

-- RLS
alter table public.achievements enable row level security;

create policy "Achievements viewable by everyone."
  on public.achievements for select
  using ( true );

-- Indexes
create index achievements_code_idx on public.achievements (code);
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  unlocked_at timestamptz default now(),
  unique(user_id, achievement_id)
);

-- RLS
alter table public.user_achievements enable row level security;

create policy "User achievements viewable by everyone."
  on public.user_achievements for select
  using ( true );

-- Indexes
create index user_achievements_user_id_idx on public.user_achievements (user_id);
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
