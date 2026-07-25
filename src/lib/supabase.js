import { createClient } from '@supabase/supabase-js'

/**
 * Both of these are safe to expose in the browser. The anon key only grants
 * whatever Row Level Security allows — see supabase/migrations/0001_schema.sql.
 *
 * The service_role key must NEVER appear in this file or anywhere in src/.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

if (!isConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set.\n' +
      'Copy .env.example to .env and fill them in. The store runs from the ' +
      'bundled catalogue until then, but accounts, orders and admin will not work.'
  )
}

export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
