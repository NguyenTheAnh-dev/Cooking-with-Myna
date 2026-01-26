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
