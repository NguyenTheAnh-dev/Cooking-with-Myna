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
