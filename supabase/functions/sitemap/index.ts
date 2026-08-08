// Generates sitemap.xml dynamically from live data — products, categories,
// and blog posts all come from Supabase, so a static sitemap file would go
// stale the moment anything changes in /admin. This queries fresh every
// time (cached briefly to keep it fast and cheap).
//
// Deploy:  supabase functions deploy sitemap
// Secret:  supabase secrets set SITE_URL=https://your-real-domain.com
//          (no trailing slash — e.g. https://supavice.ng or the Vercel URL)
//
// Also needs a rewrite so /sitemap.xml on your real domain points here —
// see the vercel.json change alongside this file.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SITE_URL = (Deno.env.get('SITE_URL') || '').replace(/\/$/, '')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

let cache = null
let cachedAt = 0
const CACHE_MS = 1000 * 60 * 30 // 30 minutes — fresh enough, cheap enough

const STATIC_PAGES = [
  { path: '/', priority: '1.0', freq: 'daily' },
  { path: '/best-value', priority: '0.8', freq: 'daily' },
  { path: '/new-arrivals', priority: '0.8', freq: 'daily' },
  { path: '/blog', priority: '0.7', freq: 'daily' },
  { path: '/contact', priority: '0.5', freq: 'monthly' },
  { path: '/delivery-returns', priority: '0.4', freq: 'monthly' },
  { path: '/prescription-orders', priority: '0.5', freq: 'monthly' },
]

Deno.serve(async (req) => {
  try {
    if (!SITE_URL) {
      return new Response('SITE_URL secret is not set. See sitemap/index.ts for instructions.', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    if (cache && Date.now() - cachedAt < CACHE_MS) {
      return xmlResponse(cache)
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

    const [{ data: categories }, { data: products }, { data: posts }] = await Promise.all([
      supabase.from('categories').select('slug'),
      supabase.from('products').select('id, updated_at').eq('active', true),
      supabase.from('blog_posts').select('slug, updated_at').eq('published', true),
    ])

    const urls = [
      ...STATIC_PAGES.map((p) => ({
        loc: `${SITE_URL}${p.path}`,
        priority: p.priority,
        freq: p.freq,
      })),
      ...(categories || []).map((c) => ({
        loc: `${SITE_URL}/category/${c.slug}`,
        priority: '0.7',
        freq: 'weekly',
      })),
      ...(products || []).map((p) => ({
        loc: `${SITE_URL}/product/${p.id}`,
        priority: '0.6',
        freq: 'weekly',
        lastmod: p.updated_at,
      })),
      ...(posts || []).map((p) => ({
        loc: `${SITE_URL}/blog/${p.slug}`,
        priority: '0.6',
        freq: 'monthly',
        lastmod: p.updated_at,
      })),
    ]

    const body =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          (u) =>
            `  <url>\n` +
            `    <loc>${escapeXml(u.loc)}</loc>\n` +
            (u.lastmod ? `    <lastmod>${u.lastmod.slice(0, 10)}</lastmod>\n` : '') +
            `    <changefreq>${u.freq}</changefreq>\n` +
            `    <priority>${u.priority}</priority>\n` +
            `  </url>\n`
        )
        .join('') +
      `</urlset>\n`

    cache = body
    cachedAt = Date.now()

    return xmlResponse(body)
  } catch (e) {
    return new Response(`Sitemap generation failed: ${e.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
})

function xmlResponse(body) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  })
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[c])
}
