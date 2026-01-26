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
