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
