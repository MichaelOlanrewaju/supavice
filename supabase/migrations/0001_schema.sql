-- ============================================================================
-- Supavice Pharmacy — database schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================================

-- ---------------------------------------------------------------- extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------- categories
create table if not exists categories (
  slug        text primary key,
  name        text not null,
  image       text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------------ products
create table if not exists products (
  id            text primary key,
  sku           text,
  name          text not null,
  brand         text not null default 'Supavice',
  price         integer not null check (price >= 0),
  was           integer check (was is null or was > price),
  category      text references categories(slug) on delete set null,
  raw_category  text,
  pom           boolean not null default false,
  stock         boolean not null default true,
  image         text,
  pack          text,
  description   text[] not null default '{}',
  tags          text[] not null default '{}',
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on products(category) where active;
create index if not exists products_brand_idx    on products(brand)    where active;
create index if not exists products_price_idx    on products(price)    where active;
create index if not exists products_tags_idx     on products using gin(tags);
-- trigram search across name and brand
create extension if not exists pg_trgm;
create index if not exists products_name_trgm_idx on products using gin (name gin_trgm_ops);

-- ------------------------------------------------------------------ profiles
-- One row per auth user. `role` drives admin access.
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  address     text,
  area        text,
  role        text not null default 'customer' check (role in ('customer','admin')),
  created_at  timestamptz not null default now()
);

-- Create a profile automatically whenever someone signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- -------------------------------------------------------------------- orders
create table if not exists orders (
  id            uuid primary key default uuid_generate_v4(),
  order_no      text unique not null,
  user_id       uuid references auth.users(id) on delete set null,
  email         text not null,
  full_name     text not null,
  phone         text not null,
  method        text not null default 'delivery' check (method in ('delivery','pickup')),
  address       text,
  area          text,
  note          text,
  payment       text not null check (payment in ('card','transfer','ussd','cod')),
  -- Delivery is quoted after the order is placed, so it is nullable and is not
  -- part of the amount charged at checkout.
  subtotal      integer not null check (subtotal >= 0),
  delivery_fee  integer,
  status        text not null default 'pending'
                check (status in ('pending','confirmed','dispatched','delivered','cancelled')),
  payment_ref   text,
  paid          boolean not null default false,
  has_pom       boolean not null default false,
  script_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_user_idx    on orders(user_id);
create index if not exists orders_status_idx  on orders(status);
create index if not exists orders_created_idx on orders(created_at desc);

-- --------------------------------------------------------------- order items
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  text,
  name        text not null,
  brand       text,
  image       text,
  price       integer not null,
  qty         integer not null check (qty > 0),
  pom         boolean not null default false
);

create index if not exists order_items_order_idx on order_items(order_id);

-- ------------------------------------------------------------------ settings
-- Key/value store for things the admin can change without a deploy.
create table if not exists settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

insert into settings (key, value) values
  ('store', '{"name":"Supavice Pharmacy","phone":"0801 234 5600","email":"orders@supavice.ng"}'),
  ('delivery', '{"note":"Delivery cost is confirmed after your order is placed.","sameDayCutoff":"16:00"}')
on conflict (key) do nothing;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table products    enable row level security;
alter table categories  enable row level security;
alter table profiles    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table settings    enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---- products & categories: world readable, admin writable ----
drop policy if exists "products readable" on products;
create policy "products readable" on products
  for select using (active = true or is_admin());

drop policy if exists "products admin write" on products;
create policy "products admin write" on products
  for all using (is_admin()) with check (is_admin());

drop policy if exists "categories readable" on categories;
create policy "categories readable" on categories for select using (true);

drop policy if exists "categories admin write" on categories;
create policy "categories admin write" on categories
  for all using (is_admin()) with check (is_admin());

-- ---- profiles: you see yourself, admins see everyone ----
drop policy if exists "profiles self read" on profiles;
create policy "profiles self read" on profiles
  for select using (id = auth.uid() or is_admin());

drop policy if exists "profiles self update" on profiles;
create policy "profiles self update" on profiles
  for update using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

drop policy if exists "profiles insert self" on profiles;
create policy "profiles insert self" on profiles
  for insert with check (id = auth.uid());

-- ---- orders: you see your own, admins see all ----
drop policy if exists "orders own read" on orders;
create policy "orders own read" on orders
  for select using (user_id = auth.uid() or is_admin());

drop policy if exists "orders insert" on orders;
create policy "orders insert" on orders
  for insert with check (user_id = auth.uid() or user_id is null);

drop policy if exists "orders admin update" on orders;
create policy "orders admin update" on orders
  for update using (is_admin()) with check (is_admin());

drop policy if exists "order_items own read" on order_items;
create policy "order_items own read" on order_items
  for select using (
    exists (select 1 from orders o
            where o.id = order_items.order_id
              and (o.user_id = auth.uid() or is_admin()))
  );

drop policy if exists "order_items insert" on order_items;
create policy "order_items insert" on order_items
  for insert with check (
    exists (select 1 from orders o
            where o.id = order_items.order_id
              and (o.user_id = auth.uid() or o.user_id is null))
  );

-- ---- settings: readable by all, writable by admin ----
drop policy if exists "settings readable" on settings;
create policy "settings readable" on settings for select using (true);

drop policy if exists "settings admin write" on settings;
create policy "settings admin write" on settings
  for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- Order number generator
-- ============================================================================
create sequence if not exists order_no_seq start 10000;

create or replace function next_order_no()
returns text language sql as $$
  select 'SUP-' || nextval('order_no_seq')::text;
$$;
