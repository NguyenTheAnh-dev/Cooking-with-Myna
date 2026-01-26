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
