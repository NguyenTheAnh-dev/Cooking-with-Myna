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
