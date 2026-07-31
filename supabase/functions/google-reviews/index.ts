// Fetches your business's real reviews from Google Places API and returns
// them to the frontend. The API key stays server-side, never in the browser.
//
// This never invents or caches fake review content — if the key or Place ID
// isn't configured, it returns { configured: false } and the frontend shows
// a plain link to your Google listing instead of numbers it can't back up.
//
// Deploy:  supabase functions deploy google-reviews
// Secrets: supabase secrets set GOOGLE_PLACES_API_KEY=your_key
//          supabase secrets set GOOGLE_PLACE_ID=your_place_id
//
// Called from the frontend as:
//   supabase.functions.invoke('google-reviews')

const API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
const PLACE_ID = Deno.env.get('GOOGLE_PLACE_ID')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Cache in memory for the life of the function instance — reviews don't
// change minute to minute, and this keeps Places API usage (and cost) low.
let cache = null
let cachedAt = 0
const CACHE_MS = 1000 * 60 * 60 * 6 // 6 hours

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  if (!API_KEY || !PLACE_ID) {
    return json({ configured: false })
  }

  if (cache && Date.now() - cachedAt < CACHE_MS) {
    return json({ configured: true, ...cache })
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount,reviews,googleMapsUri&key=${API_KEY}`
    const res = await fetch(url)
    if (!res.ok) {
      const detail = await res.text()
      return json({ configured: true, error: 'Google Places API error', detail }, 502)
    }
    const data = await res.json()

    const result = {
      rating: data.rating ?? null,
      reviewCount: data.userRatingCount ?? null,
      mapsUrl: data.googleMapsUri ?? null,
      // Google's ToS require showing real reviews as returned, not filtered
      // or reworded — pass through author, rating, relative time and text
      // exactly as Google gives them, capped at 5 as the API itself returns.
      reviews: (data.reviews || []).map((r) => ({
        author: r.authorAttribution?.displayName || 'Google user',
        photo: r.authorAttribution?.photoUri || null,
        rating: r.rating,
        text: r.text?.text || '',
        relativeTime: r.relativePublishTimeDescription || '',
      })),
    }

    cache = result
    cachedAt = Date.now()

    return json({ configured: true, ...result })
  } catch (e) {
    return json({ configured: true, error: e.message || 'Unexpected error' }, 500)
  }
})

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}
