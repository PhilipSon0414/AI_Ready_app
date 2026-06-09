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

-- Public profiles table (readable by all authenticated users, for admin panel)
create table if not exists public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email text,
  nickname text,
  xp integer default 0,
  diagnostic_level integer,
  created_at timestamptz default now(),
  last_active timestamptz default now()
);

alter table public.profiles enable row level security;

-- All authenticated users can read profiles (needed for admin to see all users)
create policy "Authenticated users can read all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Users can upsert their own profile
create policy "Users can upsert own profile"
  on public.profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
