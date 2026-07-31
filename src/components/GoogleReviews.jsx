import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Star } from './Icons'

const FALLBACK_MAPS_URL =
  'https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYppSVrPWVAxUAAAAAHQAAAAAQEA..i&pvq=Cg0vZy8xMXl6OG1iamNxIhcKEXN1cGF2aWNlIHBoYXJtYWN5EAIYAw&lqi=ChFzdXBhdmljZSBwaGFybWFjeUj2gtWJ-b2AgAhaIxAAEAEYABgBIhFzdXBhdmljZSBwaGFybWFjeSoGCAIQABABkgEIcGhhcm1hY3k&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=ng&sa=X&ftid=0x103b97285a548eef:0x595158c21e2a5c5a'

const GoogleG = (p) => (
  <svg viewBox="0 0 48 48" {...p}>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.5 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8.1l-6.5 5C9.9 39.5 16.4 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.3 5.3C40.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
  </svg>
)

/**
 * Shows real reviews pulled from the store's Google Business listing via a
 * server-side Edge Function. If that isn't configured yet, this shows a
 * plain link to the real Google listing instead — never invented ratings,
 * review counts, or quotes.
 */
export default function GoogleReviews({ compact = false }) {
  const [state, setState] = useState('loading') // loading | ok | unconfigured | error
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    if (!supabase) {
      setState('unconfigured')
      return
    }
    supabase.functions
      .invoke('google-reviews')
      .then(({ data: res, error }) => {
        if (!alive) return
        if (error || !res) return setState('unconfigured')
        if (!res.configured) return setState('unconfigured')
        if (res.error) return setState('unconfigured')
        setData(res)
        setState('ok')
      })
      .catch(() => alive && setState('unconfigured'))
    return () => {
      alive = false
    }
  }, [])

  const mapsUrl = data?.mapsUrl || FALLBACK_MAPS_URL

  if (state === 'loading') {
    return (
      <div
        className={`animate-shimmer rounded-md bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%] ${
          compact ? 'h-16' : 'h-40'
        }`}
      />
    )
  }

  // Honest fallback: no fabricated numbers, just a real link to real reviews.
  if (state === 'unconfigured' || state === 'error' || !data?.reviews?.length) {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 rounded-md border border-line bg-white transition-colors hover:border-brand-700 ${
          compact ? 'px-4 py-3' : 'px-5 py-4'
        }`}
      >
        <GoogleG className="h-6 w-6 shrink-0" />
        <span className="text-[13.5px] font-semibold text-ink-soft">
          Read our reviews on Google
        </span>
      </a>
    )
  }

  if (compact) {
    const first = data.reviews[0]
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md border border-line bg-white px-4 py-3.5 transition-colors hover:border-brand-700"
      >
        <div className="flex items-center gap-2">
          <GoogleG className="h-5 w-5 shrink-0" />
          {data.rating && (
            <span className="flex items-center gap-1 text-[13.5px] font-semibold">
              {data.rating.toFixed(1)}
              <Star className="h-3.5 w-3.5 fill-current text-accent" />
            </span>
          )}
          {data.reviewCount && (
            <span className="text-[12.5px] text-ink-mute">({data.reviewCount} reviews)</span>
          )}
        </div>
        {first?.text && (
          <p className="mt-2 line-clamp-2 text-[12.5px] italic leading-relaxed text-ink-soft">
            "{first.text}"
          </p>
        )}
      </a>
    )
  }

  return (
    <div className="rounded-md border border-line bg-white p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <GoogleG className="h-8 w-8 shrink-0" />
        {data.rating && (
          <div className="flex items-center gap-2">
            <span className="font-display text-[24px] font-semibold tracking-[-.02em]">
              {data.rating.toFixed(1)}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(data.rating) ? 'fill-current text-accent' : 'text-line'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {data.reviewCount && (
          <span className="text-[13.5px] text-ink-soft">{data.reviewCount} Google reviews</span>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[13px] font-semibold text-brand-700 hover:underline"
        >
          See all on Google
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.reviews.slice(0, 6).map((r, i) => (
          <div key={i} className="rounded-sm border border-line bg-paper p-4">
            <div className="flex items-center gap-2.5">
              {r.photo ? (
                <img src={r.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-wash text-[12px] font-bold text-brand-700">
                  {r.author.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <b className="block truncate text-[12.5px] font-semibold">{r.author}</b>
                <span className="text-[11px] text-ink-mute">{r.relativeTime}</span>
              </div>
            </div>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star
                  key={n}
                  className={`h-3 w-3 ${n < r.rating ? 'fill-current text-accent' : 'text-line'}`}
                />
              ))}
            </div>
            {r.text && (
              <p className="mt-2 line-clamp-4 text-[12.5px] leading-relaxed text-ink-soft">
                {r.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
