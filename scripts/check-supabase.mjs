#!/usr/bin/env node
/**
 * Verify the Supabase connection and report exactly what is and is not set up.
 *
 *   node scripts/check-supabase.mjs
 *
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env.
 * Uses only the publishable key, so it is safe to run anywhere.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

// --- read .env without adding a dependency ---
const envPath = path.join(root, '.env')
if (!fs.existsSync(envPath)) {
  console.error('\nNo .env file found in', root, '\n')
  // Dot-files are hidden, and many unzip tools skip them silently.
  const stray = fs
    .readdirSync(root)
    .filter((f) => f.toLowerCase().startsWith('.env') || f.toLowerCase() === 'env')
  if (stray.length) {
    console.error('Found these instead — rename one to exactly ".env":')
    stray.forEach((f) => console.error('   ', f))
  } else {
    console.error('Create it with:\n')
    console.error("  cat > .env << 'EOF'")
    console.error('  VITE_SUPABASE_URL=https://your-ref.supabase.co')
    console.error('  VITE_SUPABASE_ANON_KEY=sb_publishable_…')
    console.error('  EOF\n')
    console.error('Note: some archive tools skip dot-files. Check with  ls -la')
  }
  process.exit(1)
}
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const URL_ = env.VITE_SUPABASE_URL
const KEY = env.VITE_SUPABASE_ANON_KEY

const pass = (m) => console.log(`  \x1b[32mok\x1b[0m    ${m}`)
const fail = (m) => console.log(`  \x1b[31mfail\x1b[0m  ${m}`)
const warn = (m) => console.log(`  \x1b[33mwarn\x1b[0m  ${m}`)

console.log('\nSupabase check\n')

if (!URL_ || !KEY) {
  fail('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing from .env')
  process.exit(1)
}
pass(`url  ${URL_}`)
pass(`key  ${KEY.slice(0, 22)}…`)

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` }

async function q(table, select = 'count', extra = '') {
  const res = await fetch(`${URL_}/rest/v1/${table}?select=${select}${extra}`, {
    headers: { ...headers, Prefer: 'count=exact' },
  })
  return res
}

console.log('\nreachability')
try {
  const res = await fetch(`${URL_}/rest/v1/`, { headers })
  if (res.ok || res.status === 404) pass('project responds')
  else fail(`project returned ${res.status}`)
} catch (e) {
  fail(`cannot reach project — ${e.message}`)
  console.log('\n  Check the URL is right and the project is not paused.')
  process.exit(1)
}

console.log('\ntables')
const tables = ['categories', 'products', 'profiles', 'orders', 'order_items', 'settings']
let missing = 0
for (const t of tables) {
  const res = await q(t, 'id')
  if (res.status === 404 || res.status === 400) {
    fail(`${t} — not found`)
    missing++
  } else if (res.ok) {
    const range = res.headers.get('content-range') || ''
    const count = range.split('/')[1] ?? '?'
    pass(`${t} — ${count} rows`)
  } else {
    warn(`${t} — HTTP ${res.status} ${(await res.text()).slice(0, 90)}`)
  }
}

if (missing) {
  console.log(
    `\n  ${missing} table(s) missing. Run supabase/migrations/0001_schema.sql in the SQL Editor.`
  )
} else {
  console.log('\n  Schema looks complete.')
}

console.log('\nrow level security')
// Writing to products with only the publishable key must be rejected.
const probe = await fetch(`${URL_}/rest/v1/products`, {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: '__rls_probe__', name: 'probe', price: 1 }),
})
if (probe.status === 401 || probe.status === 403) {
  pass('anonymous writes are blocked, as they should be')
} else if (probe.ok) {
  fail('anonymous write SUCCEEDED — RLS is not protecting products')
  await fetch(`${URL_}/rest/v1/products?id=eq.__rls_probe__`, { method: 'DELETE', headers })
  console.log('    (probe row removed; re-run the schema SQL to restore policies)')
} else {
  warn(`unexpected status ${probe.status}`)
}

console.log('\nauth')
const authRes = await fetch(`${URL_}/auth/v1/settings`, { headers })
if (authRes.ok) {
  const s = await authRes.json()
  pass(`email signup ${s.external?.email === false ? 'disabled' : 'enabled'}`)
  if (s.mailer_autoconfirm === true) pass('email confirmation off — signups work immediately')
  else warn('email confirmation ON — users must click a link before signing in')
} else {
  warn(`could not read auth settings (${authRes.status})`)
}

const prodCount = await q('products', 'id')
const range = prodCount.headers.get('content-range') || ''
const n = Number(range.split('/')[1] || 0)
console.log('\nnext step')
if (missing) console.log('  Run the schema SQL, then re-run this check.')
else if (!n) console.log('  Schema is ready but empty. Seed it:\n    node scripts/seed-supabase.mjs')
else console.log(`  ${n} products loaded. Sign up at /login, then promote yourself to admin.`)
console.log()
