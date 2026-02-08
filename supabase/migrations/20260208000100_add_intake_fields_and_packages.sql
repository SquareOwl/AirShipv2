-- Expand intake fields and add package rows.

alter table public.shipment_requests
  add column if not exists ship_from_name text,
  add column if not exists ship_from_address1 text,
  add column if not exists ship_from_city text,
  add column if not exists ship_from_state text,
  add column if not exists ship_from_postal text,
  add column if not exists ship_from_country text,
  add column if not exists shipper_email text,
  add column if not exists shipper_phone text,
  add column if not exists recipient_email text,
  add column if not exists recipient_phone text,
  add column if not exists declared_value numeric,
  add column if not exists contents_description text,
  add column if not exists pickup_date date;

create table if not exists public.shipment_packages (
  id uuid primary key default gen_random_uuid(),
  shipment_request_id uuid not null references public.shipment_requests(id) on delete cascade,
  created_at timestamptz not null default now(),
  weight_lbs numeric not null,
  length_in numeric null,
  width_in numeric null,
  height_in numeric null
);

create index if not exists shipment_packages_request_id_idx
  on public.shipment_packages(shipment_request_id);

alter table public.shipment_packages enable row level security;

-- Packages policies
drop policy if exists shipment_packages_insert_own on public.shipment_packages;
create policy shipment_packages_insert_own
on public.shipment_packages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.shipment_requests sr
    where sr.id = shipment_request_id
      and sr.user_id = auth.uid()
  )
);

drop policy if exists shipment_packages_select_own on public.shipment_packages;
create policy shipment_packages_select_own
on public.shipment_packages
for select
to authenticated
using (
  exists (
    select 1
    from public.shipment_requests sr
    where sr.id = shipment_request_id
      and sr.user_id = auth.uid()
  )
);

drop policy if exists shipment_packages_admin_select_all on public.shipment_packages;
create policy shipment_packages_admin_select_all
on public.shipment_packages
for select
to authenticated
using (public.is_admin());

drop policy if exists shipment_packages_admin_update on public.shipment_packages;
create policy shipment_packages_admin_update
on public.shipment_packages
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists shipment_packages_admin_delete on public.shipment_packages;
create policy shipment_packages_admin_delete
on public.shipment_packages
for delete
to authenticated
using (public.is_admin());
