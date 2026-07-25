# Supabase setup

Everything below is free tier. Takes about ten minutes.

## 1. Create the project

1. Sign up at [supabase.com](https://supabase.com) → **New project**
2. Name it, pick a strong database password, choose the region closest to Lagos
   (**West EU (London)** is usually lowest latency from Nigeria)
3. Wait for provisioning, about two minutes

## 2. Create the tables

Dashboard → **SQL Editor** → **New query**. Paste the whole of
`supabase/migrations/0001_schema.sql` and hit **Run**.

That creates products, categories, profiles, orders, order_items and settings, plus the Row Level
Security policies that decide who can read and write what.

## 3. Connect the frontend

**Already done for this project** — `.env` is filled in and working.

Supabase now issues keys in a newer format. Either works:

| Old | New | Safe in the browser? |
|-----|-----|----------------------|
| `anon` / `public` (`eyJ…`) | **Publishable** (`sb_publishable_…`) | Yes |
| `service_role` (`eyJ…`) | **Secret** (`sb_secret_…`) | **No** |

Find them under **Settings → API Keys**. If the sidebar looks different from these instructions,
press **Ctrl+K** and search "API keys".

```env
VITE_SUPABASE_URL=https://your-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_…
```

Note these use the `VITE_` prefix, not `NEXT_PUBLIC_`. Vite only exposes variables beginning
`VITE_` to the browser, which is also what keeps everything else private.

> The **secret** key and the `postgresql://` connection string must never appear in `.env`, in
> `src/`, or in a commit. Both bypass every security rule.

Restart the dev server after editing `.env`.

## 3b. Verify the connection

```bash
npm run check
```

Reports what is reachable, which tables exist, whether Row Level Security is actually protecting
your data, and what to do next. Run it whenever something looks wrong.

## 4. Load the catalogue

```bash
SUPABASE_SERVICE_KEY=sb_secret_your_secret_key npm run seed
```

The URL is read from `.env`; only the secret needs passing in, and passing it on the command line
keeps it out of every file. The script accepts both the new `sb_secret_…` format and legacy
`service_role` JWTs.

Pushes all 930 products, their descriptions and 18 categories. Re-runnable — it upserts, so
existing rows update rather than duplicate.

## 5. Make yourself an admin

Sign up through the site at `/login` first, then in the SQL Editor:

```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

Sign out and back in. `/admin` now works.

## 6. Email confirmation (optional but recommended)

Authentication → **Providers** → **Email**. During testing you can switch **Confirm email** off so
signups work immediately. Turn it back on before launch.

---

## What the admin dashboard does

| Tab | Capability |
|-----|-----------|
| **Overview** | Product, customer and order counts, plus total order value |
| **Products** | Search, edit, add, delete. Toggle stock and visibility inline |
| **Orders** | Filter by status, change status, record the delivery fee, see line items |
| **Users** | List customers, grant or revoke admin |
| **Settings** | Store name, phone, orders email |

Hiding a product (`active = false`) removes it from the shop without deleting the record — safer
than deleting when you might restock.

## Paystack

**Public key** (`pk_…`) goes in `.env` as `VITE_PAYSTACK_PUBLIC_KEY`. Safe in the browser.

**Secret key** (`sk_…`) must never touch this codebase. It goes into Supabase Edge Function secrets:

```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

Payment verification then runs server-side in an Edge Function, where the key stays private. Anyone
who obtains a secret key can charge cards on your account.

## Free tier limits, against this store

| Limit | Free tier | This store |
|-------|-----------|-----------|
| Database | 500 MB | ~1.5 MB catalogue; ~60 MB at 50,000 orders |
| Monthly active users | 50,000 | Only signed-in customers count |
| Egress | 5 GB | ~16 KB per shopping session → ~324,000 sessions |
| API requests | Unlimited | — |
| File storage | 1 GB | 0 MB while images stay hotlinked |

Free projects **pause after 7 days with no activity**. Real traffic prevents it; if you pause during
a build gap, un-pause from the dashboard.

## Running without Supabase

The storefront still works with no keys set — products come from the bundled catalogue and checkout
completes without persisting. Accounts, order history and admin need Supabase.
