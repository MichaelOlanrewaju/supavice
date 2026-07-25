/* ------------------------------------------------------------------
   Catalogue — generated from a WooCommerce export.

   Do not edit products.json by hand. Re-run:
     python3 scripts/import-woo.py path/to/export.csv
------------------------------------------------------------------- */

import data from './products.json'

export const products = data.products
export const categories = data.categories
export const brands = data.brands
export const meta = data.meta

/* Product images are hotlinked from the live WordPress store. Routing every
   image through this one function means switching to locally hosted files
   later is a single change here, not 900 edits. */
export const productImage = (p) => p.image

export const formatNaira = (n) => '\u20A6' + n.toLocaleString('en-NG')

export const byTag = (tag, limit) => {
  const out = products.filter((x) => x.tags.includes(tag))
  return limit ? out.slice(0, limit) : out
}

export const byCategory = (slug, limit) => {
  const out = products.filter((x) => x.category === slug)
  return limit ? out.slice(0, limit) : out
}

export const discountPct = (item) =>
  item.was ? Math.round(((item.was - item.price) / item.was) * 100) : 0

export const categoryOf = (slug) => categories.find((c) => c.slug === slug)

export const findProduct = (id) => products.find((p) => p.id === id)

/* Descriptions are ~250KB of prose only the product page needs, so they load
   on demand rather than shipping with the initial bundle. */
let descCache = null
export const loadDescription = async (id) => {
  if (!descCache) {
    descCache = (await import('./descriptions.json')).default
  }
  return descCache[id] || []
}

export const relatedTo = (p, limit = 6) =>
  products
    .filter((x) => x.category === p.category && x.id !== p.id && x.stock)
    .slice(0, limit)

/* Cheapest genuine picks in a category — used where a "deals" row would
   otherwise sit, since the export carries no sale prices. */
export const bestValue = (limit = 12) =>
  [...products]
    .filter((p) => p.stock && p.tags.includes('value'))
    .sort((a, b) => a.price - b.price)
    .slice(0, limit)

/* ---------- hero banners ---------- */
export const banners = [
  {
    id: 'kids-vitamins',
    image: '/banners/kids-vitamins.jpg',
    kicker: 'For growing children',
    title: 'Vitamins built',
    titleAccent: 'for little ones.',
    body: 'Cod liver oil, DHA and multivitamins for babies through to teens. Every pack NAFDAC registered.',
    cta: 'Shop children\u2019s health',
    to: '/shop?cat=mother-baby',
    ctaSecondary: 'All vitamins',
    toSecondary: '/shop?cat=vitamins',
    badge: '75 products in stock',
    align: 'left',
  },
  {
    id: 'immune-support',
    image: '/banners/immune-support.jpg',
    kicker: 'Before harmattan',
    title: 'Build your',
    titleAccent: 'immunity.',
    body: 'Vitamin C with zinc, vitamin E and evening primrose oil from Vitabiotics, GSK and Emzor.',
    cta: 'Shop supplements',
    to: '/shop?cat=supplements',
    ctaSecondary: 'Browse vitamins',
    toSecondary: '/shop?cat=vitamins',
    badge: '103 supplements',
    align: 'left',
  },
  {
    id: 'womens-formula',
    image: '/banners/womens-formula.jpg',
    kicker: 'Daily essentials',
    title: 'One tablet,',
    titleAccent: 'covered.',
    body: 'Multivitamin, multimineral and antioxidant formulas. Ninety tablets, three months of cover.',
    cta: 'Shop multivitamins',
    to: '/shop?cat=vitamins',
    ctaSecondary: 'See what\u2019s new',
    toSecondary: '/shop?filter=new',
    badge: 'New arrivals',
    align: 'right',
  },
]

/* ---------- FAQs ---------- */
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

/* ---------- stores ---------- */
export const stores = [
  { id: 'ikorodu', name: 'Ikorodu Garage', address: '14 Lagos Road, opposite Ikorodu Garage roundabout, Ikorodu', phone: '0801 234 5601', hours: 'Closes 21:00', open24: false },
  { id: 'lekki', name: 'Lekki Phase 1', address: 'Plot 8B Admiralty Way, beside the roundabout, Lekki Phase 1', phone: '0801 234 5602', hours: 'Never closes', open24: true },
  { id: 'vi', name: 'Victoria Island', address: '45 Saka Tinubu Street, off Adeola Odeku, Victoria Island', phone: '0801 234 5603', hours: 'Never closes', open24: true },
  { id: 'ikeja', name: 'Ikeja GRA', address: '27 Isaac John Street, GRA Ikeja, Lagos', phone: '0801 234 5604', hours: 'Closes 22:00', open24: false },
  { id: 'surulere', name: 'Surulere', address: '102 Adeniran Ogunsanya Street, Surulere, Lagos', phone: '0801 234 5605', hours: 'Closes 21:00', open24: false },
  { id: 'yaba', name: 'Yaba Market', address: '3 Herbert Macaulay Way, beside Yaba bus stop, Yaba', phone: '0801 234 5606', hours: 'Closes 20:00', open24: false },
  { id: 'festac', name: 'Festac Town', address: '21 Road, 2nd Avenue, Festac Town, Amuwo Odofin', phone: '0801 234 5607', hours: 'Closes 20:30', open24: false },
  { id: 'ajah', name: 'Ajah Junction', address: 'Km 22 Lekki-Epe Expressway, beside Ajah bus stop, Ajah', phone: '0801 234 5608', hours: 'Closes 22:00', open24: false },
  { id: 'maryland', name: 'Maryland Mall', address: '350 Ikorodu Road, Maryland Mall ground floor, Maryland', phone: '0801 234 5609', hours: 'Closes 21:00', open24: false },
]
