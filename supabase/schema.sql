-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (linked to Supabase auth)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Rooms table
create table if not exists rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_per_night numeric(10,2) not null,
  capacity integer not null default 2,
  images jsonb default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bookings table
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete restrict,
  user_id uuid references users(id) on delete set null,
  guest_name text,
  guest_email text,
  check_in_date date not null,
  check_out_date date not null,
  total_price numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  razorpay_payment_id text,
  is_guest boolean not null default false,
  created_at timestamptz not null default now(),
  constraint check_dates check (check_out_date > check_in_date)
);

-- RLS policies
alter table users enable row level security;
alter table rooms enable row level security;
alter table bookings enable row level security;

-- Users: anyone can read their own record, service role can do anything
create policy "Users can view own profile" on users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on users
  for update using (auth.uid() = id);
create policy "Service role full access to users" on users
  for all using (true) with check (true);

-- Rooms: public read for active rooms
create policy "Anyone can view active rooms" on rooms
  for select using (is_active = true);
create policy "Service role full access to rooms" on rooms
  for all using (true) with check (true);

-- Bookings: user can see own bookings
create policy "Users can see own bookings" on bookings
  for select using (auth.uid() = user_id);
create policy "Service role full access to bookings" on bookings
  for all using (true) with check (true);

-- Seed rooms data
insert into rooms (name, description, price_per_night, capacity, images, is_active) values
  ('Standard Room (Non-AC)', 'Comfortable standard room with all basic amenities. Clean, well-maintained with quality bedding.', 800, 2, '[]', true),
  ('Standard Room (AC)', 'Air-conditioned standard room for a comfortable stay. Includes TV, Wi-Fi, and attached bathroom.', 1200, 2, '[]', true),
  ('Family Room', 'Spacious family room accommodating up to 4 guests. Ideal for families with extra space and amenities.', 1800, 4, '[]', true)
on conflict do nothing;
