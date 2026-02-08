-- AirShipv2 initial schema (profiles + shipment requests) with RLS.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'CUSTOMER' check (role in ('ADMIN', 'CUSTOMER')),
  created_at timestamptz not null default now()
);

create table if not exists public.shipment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),

  status text not null default 'NEW' check (status in ('NEW', 'REVIEWED', 'COMPLETED', 'REJECTED')),

  ship_to_name text not null,
  ship_to_address1 text not null,
  ship_to_city text not null,
  ship_to_state text not null,
  ship_to_postal text not null,
  ship_to_country text not null,

  package_weight_lbs numeric not null,
  package_length_in numeric null,
  package_width_in numeric null,
  package_height_in numeric null,

  reference text null,
  notes text null,
  internal_notes text null
);

create index if not exists shipment_requests_user_id_idx on public.shipment_requests(user_id);
create index if not exists shipment_requests_created_at_idx on public.shipment_requests(created_at desc);

-- Helper for RLS checks
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'ADMIN'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.shipment_requests enable row level security;

-- Profiles policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_admin_select_all on public.profiles;
create policy profiles_admin_select_all
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists profiles_admin_insert on public.profiles;
create policy profiles_admin_insert
on public.profiles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Shipment request policies
drop policy if exists shipment_requests_insert_own on public.shipment_requests;
create policy shipment_requests_insert_own
on public.shipment_requests
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists shipment_requests_select_own on public.shipment_requests;
create policy shipment_requests_select_own
on public.shipment_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists shipment_requests_admin_select_all on public.shipment_requests;
create policy shipment_requests_admin_select_all
on public.shipment_requests
for select
to authenticated
using (public.is_admin());

drop policy if exists shipment_requests_admin_update on public.shipment_requests;
create policy shipment_requests_admin_update
on public.shipment_requests
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
