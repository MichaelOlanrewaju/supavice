# Supavice Pharmacy

Pharmacy e-commerce storefront. React 18 + Vite 5 + Tailwind 3 + React Router 6.

Catalogue is **930 real products** imported from a WooCommerce export. Store addresses, phone
numbers and PCN licence details are still placeholders — replace before launch.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview
```

Node 18 or newer.

## Updating the catalogue

Product data is generated, never hand-edited:

```bash
python3 scripts/import-woo.py path/to/wc-product-export.csv
```

This rewrites `src/data/products.json`. The importer:

- keeps only published rows that have a price and an image (930 of 1,057)
- collapses 57 raw WooCommerce categories into 18 browsable groups
- reads the `Tags` column for prescription status — 307 ℞, no conflicts
- rewrites competitor house brands (`HealthPlus Pharmacy`, `Pharmacy Plus`) to `Supavice`
- extracts pack size from product names (`x30`, `150ml`, `20 Tablets`)
- derives merchandising tags: `popular`, `value`, `new`, `own-brand`
- picks a real product photo for each category tile (no icons or emoji anywhere)
- parses the `Description` column into clean paragraphs (927 of 930 products)

Category and brand mappings live at the top of `scripts/import-woo.py` — edit them there.

### Category images

Category tiles use a real product shot from that category rather than an icon. The preferred
product per category is listed in `CATEGORY_IMAGE_PICK` at the top of the importer; if that product
is missing from a future export, it falls back to the first in-stock product whose image is not the
WooCommerce placeholder. 65 products in the current export use that placeholder — worth uploading
real photos for those in WordPress.

### Descriptions

Product copy comes from the WooCommerce `Description` column — note that `Short description` is
empty across this export, so the importer reads the full field and splits it into paragraphs on
`<p>` and `<br>` boundaries.

They are written to a **separate** `src/data/descriptions.json` and loaded on demand by the product
page, because 250KB of prose should not ship with the homepage. The product page shows the first two
paragraphs with a "Read more" toggle for the rest.

### A note on discounts

The export contains no sale prices, so there are no genuine discounts. Rather than invent "was"
prices, the storefront merchandises on real signals: **Best value** (actually the cheapest lines in
each category) and **Popular**. If you add sale prices in WooCommerce and re-import, `deal` tags
and strikethrough pricing appear automatically — the components already handle them.

## Product images

Images are **hotlinked** from `eutawpharmacycare.com`. Every image reference routes through one
function in `src/data/catalog.js`:

```js
export const productImage = (p) => p.image
```

To switch to locally hosted images later, download `wp-content/uploads` into `public/products/` and
change that one line:

```js
export const productImage = (p) => '/products/' + p.image.split('/').pop()
```

Nothing else changes. Cards handle load failure with a branded fallback and a shimmer placeholder
while loading, so a broken URL never leaves an empty box.

## Homepage structure

Sections deliberately alternate width, background and layout so the page does not read as a stack
of identical carousels:

| # | Section | Component | Treatment |
|---|---------|-----------|-----------|
| 1 | Hero slider | `PromoSlider` | Full-width, 3 banners |
| 2 | Perks strip | inline | 4-up hairline row |
| 3 | Shop by category | `CategoryMosaic` | Large feature tile + 6 small |
| 4 | Popular this month | `ProductCarousel` | White band, scrolls |
| 5 | Know your numbers | `ProductSpotlight` | Hero product + 4 picks, light |
| 6 | Best value picks | `ProductCarousel` | Paper background |
| 7 | Mother & baby | inline | Editorial split, copy + 6 cards |
| 8 | Supplements | `ProductSpotlight` | Hero product + 4 picks, **dark** |
| 9 | New arrivals | `ProductCarousel` | Paper background |
| 10 | Browse the rest | inline | Remaining 11 categories, compact |
| 11 | Brands | inline | 12-up grid |
| 12 | Delivery band | inline | Dark panel + stat grid |
| 13 | FAQ | `Faq` | Two-column |

### Spotlight product selection

`ProductSpotlight` takes a `hero` and up to four `picks`. Home picks these from live data rather
than hardcoding IDs, filtering out placeholder images and out-of-stock lines. The supplements
spotlight also excludes sports-nutrition products, which otherwise dominate on price and read wrong
for a pharmacy.

## Pages

| Route          | File                 | What it does                                    |
| -------------- | -------------------- | ----------------------------------------------- |
| `/`            | `pages/Home.jsx`     | Hero slider, categories, 3 product rows, brands  |
| `/shop`        | `pages/Shop.jsx`     | Filters, sort, pagination (24/page, 39 pages)    |
| `/product/:id` | `pages/Product.jsx`  | Detail, quantity, SKU, related items             |
| `/cart`        | `pages/Cart.jsx`     | Line items, free-delivery threshold              |
| `/checkout`    | `pages/Checkout.jsx` | Delivery → payment → review → confirmation       |
| `/stores`      | `pages/Stores.jsx`   | 9 branches, search, 24-hour filter               |
| `/about`       | `pages/About.jsx`    | Timeline, values, regulatory disclosure          |
| `/contact`     | `pages/Contact.jsx`  | Four support desks, form                         |

URL-driven shop filters, all shareable:

```
/shop?cat=infections     category      /shop?brand=GSK        brand
/shop?q=augmentin        search        /shop?filter=value     cheapest lines
/shop?sort=low&page=3    sort + page   /shop?filter=new       new arrivals
```

## Typography

| Role    | Face             | Why                                                     |
| ------- | ---------------- | ------------------------------------------------------- |
| Display | **Clash Display** | Tight geometric sans with real character in the counters |
| Body    | **Satoshi**       | Refined grotesque, holds up at 13px on product cards     |
| Numeric | **JetBrains Mono**| Prices, SKUs, metadata — true tabular figures            |

Served from Fontshare. The scale lives in `tailwind.config.js` as `text-display-xl/lg/md/sm`, with
tracking tightening as size increases (−0.04em at the top). Fallbacks are declared, so the site
degrades gracefully if Fontshare is unreachable.

## Brand

Colours sampled directly from the logo PNG.

| Token       | Hex       | Use                                              |
| ----------- | --------- | ------------------------------------------------ |
| `brand`     | `#00CCFF` | Logo cyan — accents, highlights, hover borders    |
| `brand-700` | `#0077A3` | Text, links, primary buttons (4.78:1 on white)    |
| `brand-800` | `#005E82` | Pressed-button shadow                             |
| `rx`        | `#FF0000` | Logo red — ℞ badges, discount tags                |
| `rx-600`    | `#D40000` | Red CTAs (5.53:1 with white text)                 |
| `ink`       | `#071A2E` | Body text                                         |
| `paper`     | `#F6F9FC` | Page background                                   |

The pure logo colours can't carry text — `#00CCFF` scores 1.8:1 on white, and white on cyan is
1.9:1, both far below the 4.5:1 minimum. So bright brand tones handle fills and accents while the
darker steps take anything with words in or on it.

Logo files in `public/brand/`: standard and `@2x` for the header, a white variant for the dark
footer, and 32/180/512px icons for favicon, Apple touch and PWA manifest.

## Build output

Chunked so a catalogue update doesn't bust the app cache:

| Chunk          | Gzipped | Loaded            |
| -------------- | ------- | ----------------- |
| `catalog`      | 79 KB   | always            |
| `react`        | 50 KB   | always            |
| `index`        | 24 KB   | always            |
| `vendor`       | 4 KB    | always            |
| CSS            | 8 KB    | always            |
| `descriptions` | 77 KB   | product page only |

Initial load is about 165 KB gzipped; descriptions arrive only when a product page opens.

## Backend

Supabase provides the database, authentication and admin. See **SUPABASE_SETUP.md** for the full
walkthrough; the short version:

1. Run `supabase/migrations/0001_schema.sql` in the SQL Editor
2. Copy `.env.example` to `.env` and add your project URL and anon key
3. `node scripts/seed-supabase.mjs` to push the 930 products
4. Sign up, then promote yourself to admin with one SQL statement

The storefront works without any of this — products come from the bundled catalogue and checkout
completes locally. Accounts, order history and admin need Supabase connected.

### Key safety

Only two values ever reach the browser, both public: `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. The anon key grants only what Row Level Security permits.

The `service_role` key and the Paystack secret key must never appear in `src/` or `.env`. The seed
script reads the service key from the environment at run time; the Paystack secret belongs in
Supabase Edge Function secrets.

### Delivery

Delivery is **not** charged at checkout. Orders store `subtotal` as the payable amount and
`delivery_fee` stays null until an admin sets it from the Orders tab after speaking to the customer.

## Deploying

`vercel.json`, `netlify.toml` and `public/_redirects` are included — all three rewrite every path to
`index.html` so deep links work. Without this, refreshing on `/product/anything` 404s. For nginx:
`try_files $uri $uri/ /index.html;`

## Before production

- Wire checkout to Paystack or Flutterwave — the payment step is inert
- Add auth, order history and tracking
- Replace store addresses, phone numbers and the PCN premises licence in the footer
- 95 products were skipped for having no price — add prices in WooCommerce and re-import
- Consider moving images off the WordPress host onto a CDN
- Prescription uploads carry health data: encrypt in transit and at rest, restrict access to the
  dispensing pharmacist
