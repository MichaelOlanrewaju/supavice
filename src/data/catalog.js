/* ------------------------------------------------------------------
   Catalogue — live from Supabase.

   Product data now comes straight from the database, so an edit or
   delete in /admin shows up on the storefront without a rebuild. A
   simple in-memory cache means only the first fetch per visit hits the
   network; subsequent page views inside the same session reuse it.

   If Supabase isn't configured (local dev without keys), everything
   falls back to the last-known bundled snapshot in products.json so the
   storefront still has something to show.
------------------------------------------------------------------- */

import { supabase } from '../lib/supabase'
import fallbackData from './products.json'

export const formatNaira = (n) => '\u20A6' + n.toLocaleString('en-NG')

export const productImage = (p) => p.image

export const discountPct = (item) =>
  item.was ? Math.round(((item.was - item.price) / item.was) * 100) : 0

/* ---------- normalize a Supabase row to the same shape the UI expects ---------- */
const fromRow = (r) => ({
  id: r.id,
  sku: r.sku,
  name: r.name,
  brand: r.brand,
  price: r.price,
  was: r.was,
  category: r.category,
  rawCategory: r.raw_category,
  pom: r.pom,
  stock: r.stock,
  image: r.image,
  pack: r.pack,
  tags: r.tags || [],
})

/* ---------- cache ---------- */
let productsCache = null
let categoriesCache = null
let inFlight = null

async function loadAll() {
  if (productsCache && categoriesCache) return { products: productsCache, categories: categoriesCache }
  if (inFlight) return inFlight

  inFlight = (async () => {
    if (!supabase) {
      // No backend configured — use the bundled snapshot so the site still
      // works in local dev without Supabase keys.
      productsCache = fallbackData.products
      categoriesCache = fallbackData.categories
      return { products: productsCache, categories: categoriesCache }
    }

    try {
      const [{ data: prodRows, error: prodErr }, { data: catRows, error: catErr }] = await Promise.all([
        supabase.from('products').select('*').eq('active', true),
        supabase.from('categories').select('*').order('sort_order'),
      ])

      if (prodErr || catErr) throw prodErr || catErr

      productsCache = (prodRows || []).map(fromRow)
      categoriesCache = (catRows || []).map((c) => ({
        slug: c.slug,
        name: c.name,
        image: c.image,
        count: productsCache.filter((p) => p.category === c.slug).length,
      }))
    } catch (e) {
      console.error('[catalog] live fetch failed, falling back to bundled snapshot:', e.message)
      productsCache = fallbackData.products
      categoriesCache = fallbackData.categories
    }

    return { products: productsCache, categories: categoriesCache }
  })()

  const result = await inFlight
  inFlight = null
  return result
}

/* Call this after an admin action if you want the very next page load in
   this tab to refetch instead of reusing the cache. Not required for a
   normal visit — a fresh page load always gets current data anyway. */
export const invalidateCatalogCache = () => {
  productsCache = null
  categoriesCache = null
}

export const fetchProducts = async () => (await loadAll()).products

export const fetchCategories = async () => (await loadAll()).categories

export const fetchBrands = async () => {
  const { products } = await loadAll()
  const counts = new Map()
  for (const p of products) {
    if (!p.brand) continue
    counts.set(p.brand, (counts.get(p.brand) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export const fetchProduct = async (id) => {
  const { products } = await loadAll()
  return products.find((p) => p.id === id) || null
}

export const fetchByTag = async (tag, limit) => {
  const { products } = await loadAll()
  const out = products.filter((x) => x.tags.includes(tag))
  return limit ? out.slice(0, limit) : out
}

export const fetchByCategory = async (slug, limit) => {
  const { products } = await loadAll()
  const out = products.filter((x) => x.category === slug)
  return limit ? out.slice(0, limit) : out
}

export const fetchBestValue = async (limit = 12) => {
  const { products } = await loadAll()
  return [...products]
    .filter((p) => p.stock && p.tags.includes('value'))
    .sort((a, b) => a.price - b.price)
    .slice(0, limit)
}

export const fetchRelated = async (product, limit = 6) => {
  const { products } = await loadAll()
  return products
    .filter((x) => x.category === product.category && x.id !== product.id && x.stock)
    .slice(0, limit)
}

/* Descriptions still come from Supabase directly on the product row now
   (see `description text[]` in the schema) — kept as a function for the
   same call shape the Product page already uses. */
export const loadDescription = async (id) => {
  if (!supabase) {
    const desc = (await import('./descriptions.json')).default
    return desc[id] || []
  }
  const { data, error } = await supabase.from('products').select('description').eq('id', id).maybeSingle()
  if (error || !data) return []
  return data.description || []
}

/* ---------- hero banners (editorial content, not product data — stays static) ---------- */
export const banners = [
  {
    id: 'kids-vitamins',
    image: '/banners/kids-vitamins.jpg',
    kicker: 'For growing children',
    title: 'Vitamins built',
    titleAccent: 'for little ones.',
    body: 'Cod liver oil, DHA and multivitamins for babies through to teens. Every pack NAFDAC registered.',
    cat: 'mother-baby',
    cta: 'Ask about this range',
    to: '/contact',
    badge: 'In stock now',
    align: 'left',
  },
  {
    id: 'immune-support',
    image: '/banners/immune-support.jpg',
    kicker: 'Before harmattan',
    title: 'Build your',
    titleAccent: 'immunity.',
    body: 'Vitamin C with zinc, vitamin E and evening primrose oil from Vitabiotics, GSK and Emzor.',
    cat: 'supplements',
    cta: 'Ask about this range',
    to: '/contact',
    badge: 'Popular this month',
    align: 'left',
  },
  {
    id: 'womens-formula',
    image: '/banners/womens-formula.jpg',
    kicker: 'Daily essentials',
    title: 'One tablet,',
    titleAccent: 'covered.',
    body: 'Multivitamin, multimineral and antioxidant formulas. Ninety tablets, three months of cover.',
    cat: 'vitamins',
    cta: 'Ask about this range',
    to: '/contact',
    badge: 'New arrivals',
    align: 'right',
  },
]

/* ---------- FAQs (editorial content, stays static) ---------- */
export const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Orders placed before 16:00 on Lagos island and mainland usually arrive the same day, most within 90 minutes. Outside Lagos, expect 2 to 4 working days through our courier partners.',
  },
  {
    q: 'What does the \u211E badge mean?',
    a: 'It marks a prescription-only medicine. You can add it to your cart as normal, but you will be asked to upload your doctor\u2019s script at checkout. A pharmacist checks it before the order is dispensed. Everything without the badge ships straight away.',
  },
  {
    q: 'How do I know the medicine is genuine?',
    a: 'We buy only from manufacturers and their appointed distributors, never the open market. Every pack carries a NAFDAC number and a scannable batch code you can check on arrival.',
  },
  {
    q: 'What can I pay with?',
    a: 'Card, bank transfer and USSD at checkout, or cash and POS on delivery within Lagos. Company and HMO accounts can be invoiced monthly.',
  },
  {
    q: 'Can I return something?',
    a: 'Medicine cannot be returned once it has left our custody \u2014 a Pharmacy Council of Nigeria safety rule, not a shop policy. Devices, supplements and personal care items can be returned unopened within 7 days. Wrong or damaged item? Tell us within 48 hours and we replace it free.',
  },
  {
    q: 'Do you deliver outside Lagos?',
    a: 'Yes, to all 36 states, typically 2 to 4 working days. Cold-chain items are restricted to states we can reach within 24 hours; the product page tells you before you order.',
  },
]
