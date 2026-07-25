#!/usr/bin/env node
/**
 * Push the generated catalogue into Supabase.
 *
 *   node scripts/seed-supabase.mjs
 *
 * Requires two environment variables. The service role key bypasses RLS, so it
 * is read from the environment and must never be committed or shipped to the
 * browser:
 *
 *   SUPABASE_URL=https://xxxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJhbG... \
 *   node scripts/seed-supabase.mjs
 *
 * Run scripts/import-woo.py first so products.json and descriptions.json exist.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/* Falls back to .env for the URL so only the secret needs passing in. */
function readEnvFile() {
  const p = path.join(root, '.env')
  if (!fs.existsSync(p)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(p, 'utf8')
      .split('\n')
      .filter((l) => l.trim() && !l.trim().startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      })
  )
}
const fileEnv = readEnvFile()

const URL = process.env.SUPABASE_URL || fileEnv.VITE_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_KEY

if (!URL || !KEY) {
  console.error('Missing configuration.\n')
  console.error('  SUPABASE_URL           read from .env, or pass it explicitly')
  console.error('  SUPABASE_SERVICE_KEY   your secret key — pass on the command line only\n')
  console.error('Example:')
  console.error('  SUPABASE_SERVICE_KEY=sb_secret_xxx node scripts/seed-supabase.mjs\n')
  console.error('Find the secret key under Settings → API Keys. Never commit it.')
  process.exit(1)
}

/* Supabase accepts both the legacy service_role JWT and the newer
   sb_secret_ format. Both go in the apikey header; only JWTs are also
   sent as a bearer token. */
const isJwt = KEY.startsWith('ey')
const authHeaders = {
  apikey: KEY,
  ...(isJwt ? { Authorization: `Bearer ${KEY}` } : {}),
}

if (KEY.startsWith('sb_publishable_') || KEY.startsWith('ey') === false && !KEY.startsWith('sb_secret_')) {
  if (KEY.startsWith('sb_publishable_')) {
    console.error('That is the publishable key. Seeding needs the SECRET key (sb_secret_…).')
    process.exit(1)
  }
}

const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/products.json'), 'utf8'))
const descriptions = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/descriptions.json'), 'utf8')
)

async function upsert(table, rows, conflict = 'id') {
  const res = await fetch(`${URL}/rest/v1/${table}?on_conflict=${conflict}`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    throw new Error(`${table}: ${res.status} ${await res.text()}`)
  }
}

const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

console.log('seeding', URL)

// ---- categories ----
const categories = data.categories.map((c, i) => ({
  slug: c.slug,
  name: c.name,
  image: c.image || null,
  sort_order: i,
}))
await upsert('categories', categories, 'slug')
console.log(`  categories  ${categories.length}`)

// ---- products ----
const products = data.products.map((p) => ({
  id: p.id,
  sku: p.sku || null,
  name: p.name,
  brand: p.brand,
  price: p.price,
  was: p.was,
  category: p.category,
  raw_category: p.rawCategory || null,
  pom: p.pom,
  stock: p.stock,
  image: p.image,
  pack: p.pack || null,
  description: descriptions[p.id] || [],
  tags: p.tags || [],
  active: true,
}))

let done = 0
for (const batch of chunk(products, 200)) {
  await upsert('products', batch)
  done += batch.length
  process.stdout.write(`\r  products    ${done}/${products.length}`)
}
console.log()
console.log('done.')
console.log()
console.log('Next: make yourself an admin by running this in the SQL Editor,')
console.log('after signing up through the site:')
console.log("  update profiles set role = 'admin' where id =")
console.log("    (select id from auth.users where email = 'you@example.com');")
