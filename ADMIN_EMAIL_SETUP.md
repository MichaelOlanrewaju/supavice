# Order email notifications

Sends an email to you whenever an order is placed — customer details, items, total, and whether
payment is confirmed.

## 1. Get a Resend account (free)

[resend.com](https://resend.com) → sign up → **API Keys** → create one. Free tier covers 3,000
emails/month, 100/day — more than enough for order notifications.

## 2. Set the secrets

```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set ADMIN_NOTIFY_EMAIL=your@email.com
```

For more than one recipient, comma-separate:

```bash
supabase secrets set ADMIN_NOTIFY_EMAIL=mikealdoyinolanrewaju@gmail.com,muyex2021@gmail.com
```

## 3. Deploy

```bash
supabase functions deploy notify-admin-order
```

## 4. Test it

Place a real order through the site and check your inbox. Also check the function logs if nothing
arrives:

Supabase dashboard → **Edge Functions** → **notify-admin-order** → **Logs**

## About the sender address

The function sends from `orders@resend.dev`, Resend's shared testing domain — works immediately, no
setup, but looks less polished and may land in spam more often. To send from your own domain
(`orders@supavice.ng`), verify that domain in Resend's dashboard, then change the `from` field in
`supabase/functions/notify-admin-order/index.ts` and redeploy.

## What happens if this isn't set up

Checkout is completely unaffected. The notification call is fire-and-forget — if the email fails or
isn't configured, the customer's order still saves normally and nothing breaks. You just won't get
an email; the order is still sitting in Supabase → Table Editor → `orders`.
