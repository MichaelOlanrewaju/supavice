# Deploying to Vercel

## Before you start

Your Supabase keys live in `.env`, which is **not** committed to Git (correctly). Vercel therefore
cannot see them at build time — you set them in the Vercel dashboard instead. Miss this step and the
deployed site loads but cannot sign in, save orders, or reach the admin.

The two values to set (both safe to expose — the publishable key only grants what RLS allows):

```
VITE_SUPABASE_URL         = https://ipsjxtuqfskfwvsubmec.supabase.co
VITE_SUPABASE_ANON_KEY    = sb_publishable_QyJoj8ieJ6Fn-w5tcCRjTw_1m2uavyb
VITE_PAYSTACK_PUBLIC_KEY  = (leave blank until you wire up payments)
```

---

## Path A — GitHub + Vercel (recommended)

Best for a real store: every push auto-deploys, and you get preview URLs for changes.

**1. Put the project on GitHub**

```bash
cd supavice-pharmacy
git init
git add .
git commit -m "Supavice Pharmacy storefront"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/supavice-pharmacy.git
git push -u origin main
```

Confirm `.env` and `env.local.txt` are NOT in the push — `git status` should not list them. They are
gitignored, so they will not be.

**2. Import into Vercel**

- Go to vercel.com → **Add New** → **Project**
- Import your GitHub repo
- Framework preset auto-detects as **Vite**
- Before clicking Deploy, open **Environment Variables** and add the three above
- Deploy

**3. Every future change**

```bash
git add .
git commit -m "what changed"
git push
```

Vercel rebuilds automatically.

---

## Path B — Vercel CLI (no GitHub)

Faster for a one-off, but you deploy manually each time.

```bash
npm i -g vercel
cd supavice-pharmacy
vercel            # first run: answer the prompts, creates the project
```

Then add the environment variables:

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

Paste each value when prompted. Then deploy to production:

```bash
vercel --prod
```

---

## After it is live

**1. Point Supabase at the live URL.** Supabase → **Authentication** → **URL Configuration**:
- Set **Site URL** to your Vercel URL (e.g. `https://supavice.vercel.app`)
- Add it under **Redirect URLs** too, so password-reset and confirmation links work

Without this, auth emails send people back to `localhost`.

**2. Test the live site:** sign in, add to cart, place an order, check it lands in `/admin`.

**3. Custom domain** (optional): Vercel → project → **Settings** → **Domains** → add `supavice.ng`
or similar, and follow the DNS instructions.

---

## What is NOT yet handled

- **Payments.** Paystack is not wired up. Checkout records the order but takes no money. Do this
  before real customers arrive.
- **Email confirmation.** If still switched off in Supabase for testing, turn it back on and connect
  an SMTP provider before launch, or anyone can register with any email.
- **Product images** still hotlink from `eutawpharmacycare.com`. Fine to launch, but move them to
  your own hosting or a CDN when you can.
