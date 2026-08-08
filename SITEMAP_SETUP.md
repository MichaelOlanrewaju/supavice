# Sitemap for SEO

`/sitemap.xml` lists every real page on your site so Google can find and index them — every
product, category, and all 54+ blog articles, generated fresh from your live database rather than
a fixed file that goes stale the moment you add a product.

## 1. Set your real domain

```bash
supabase secrets set SITE_URL=https://your-real-domain.com
```

No trailing slash. Use whatever your actual live URL is — your Vercel URL if you haven't set up a
custom domain yet, or `https://supavice.ng` once you have.

## 2. Deploy the function

```bash
supabase functions deploy sitemap
```

## 3. Fix robots.txt — I couldn't do this part for you

`public/robots.txt` currently has a placeholder:

```
Sitemap: https://REPLACE-WITH-YOUR-REAL-DOMAIN/sitemap.xml
```

**Open that file and replace it with your actual domain**, then push the change. I don't know your
final live domain, so I left an obvious placeholder rather than guess wrong — a guessed-wrong domain
in a file this important would be worse than an obvious blank to fill in.

## 4. Test it

Once deployed and pushed, visit `https://your-domain.com/sitemap.xml` directly in a browser. You
should see raw XML listing every page — not your homepage, and not a 404.

## 5. Submit it to Google

[Google Search Console](https://search.google.com/search-console) → add your site if you haven't →
**Sitemaps** → submit `sitemap.xml`. This is what actually gets your 54 blog articles and full
product catalogue into Google's index — the file existing alone doesn't do it automatically.

## What's in it

| Content | Priority | How often it changes |
|---|---|---|
| Homepage | Highest | Daily |
| Best value / New arrivals | High | Daily |
| Every category page | Medium-high | Weekly |
| Every active product | Medium | Weekly |
| Every published blog post | Medium | Monthly |
| Contact, delivery info, etc. | Lower | Monthly |

Admin, account, checkout and cart pages are deliberately excluded — nothing there is meant to be
indexed by search engines, and `robots.txt` blocks them explicitly too.

## Keeping it current

Nothing to maintain. It queries live data on every request (cached 30 minutes to keep it fast), so
a new blog post or product appears in the sitemap automatically — no rebuild, no manual update.
