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
