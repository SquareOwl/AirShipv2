# AirShipv2

Minimal shipping intake form (customers) + admin dashboard (admins) using:

- Next.js (App Router)
- Supabase (Auth + Postgres)
- Render (hosting)

## Local dev

1) Install deps

```bash
npm install
```

2) Create `.env.local`

Copy from [.env.example](.env.example) and fill in values from your Supabase project.

3) Run

```bash
npm run dev
```

Open http://localhost:3000

## Supabase schema + RLS

The initial schema/policies are in [supabase/migrations/20260208000000_init.sql](supabase/migrations/20260208000000_init.sql).

Apply it using one of:

- Supabase SQL editor (paste + run)
- Supabase CLI migrations (recommended once you set up CLI for this repo)

### Create the first admin

1) Create a Supabase Auth user (via Supabase dashboard or any sign-in flow)
2) Insert/update their profile role:

```sql
insert into public.profiles (id, role)
values ('<AUTH_USER_UUID>', 'ADMIN')
on conflict (id) do update set role = excluded.role;
```

## App routes

- `/login` email/password login (Supabase Auth)
- `/intake` customer-only shipping intake
- `/admin/*` admin-only dashboard

## Render deploy (clean basics)

1) Create a Render **Web Service** from this repo
2) Set build/start commands:

- Build: `npm install && npm run build`
- Start: `npm run start`

3) Set env vars on Render:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

4) In Supabase Auth settings, add your Render domain to allowed redirect URLs.
