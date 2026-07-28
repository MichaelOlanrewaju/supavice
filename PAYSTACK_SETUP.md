# Getting Paystack actually working

Checkout is wired up but **cannot charge anyone yet** until you complete these steps. Right now,
placing an order saves it to the database as unpaid and stops there.

## 1. Get your keys

Paystack dashboard → **Settings** → **API Keys & Webhooks**. Use **test mode** keys first
(`pk_test_...` / `sk_test_...`) until everything works, then switch to live keys.

## 2. Public key — frontend

```bash
# .env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

Restart the dev server after editing `.env`. Redeploy on Vercel with the same variable added under
Project → Settings → Environment Variables.

## 3. Secret key — server only, never in this codebase

The secret key can charge cards. It belongs only in Supabase's own secret storage, never in `.env`,
never in `src/`, never in a commit.

```bash
supabase login
supabase link --project-ref ipsjxtuqfskfwvsubmec
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

## 4. Deploy the verification function

```bash
supabase functions deploy verify-paystack
```

This is the piece that actually matters for security. When Paystack's popup reports "payment
successful," that message comes from the customer's browser — it can be faked by anyone with
devtools open. `verify-paystack` re-checks the transaction directly with Paystack's API using the
secret key, confirms the amount matches the order, and only then marks the order paid. Nothing is
trusted from the client alone.

## 5. Test it

Use Paystack's test cards (listed in their dashboard) to run a full order through test mode. Confirm
in Supabase → Table Editor → `orders` that `paid` flips to `true` and `payment_ref` is filled in
after a successful test payment.

## What happens if a step is skipped

| Missing | What happens |
|---|---|
| Public key | Order saves as unpaid; customer sees a message that payment isn't set up yet, and you're expected to contact them to arrange payment |
| Edge Function not deployed | Paystack popup opens and can appear to succeed, but verification fails — the order stays unpaid and the customer sees an error asking them to call you |
| Secret key not set | The Edge Function itself returns an error rather than silently marking anything paid |

None of these silently take money without confirming it — they fail toward "unpaid, contact the
customer," not toward falsely marking an order paid.
