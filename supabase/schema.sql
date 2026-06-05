create table if not exists public.user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table public.user_data enable row level security;

create policy "Users can only access own data"
  on public.user_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
