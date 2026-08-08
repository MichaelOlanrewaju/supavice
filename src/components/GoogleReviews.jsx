import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { testimonials } from '../data/testimonials'
import { Star, ChevLeft, ChevRight } from './Icons'

const FALLBACK_MAPS_URL =
  'https://www.google.com/maps/place/Supavice+pharmacy+%26+stores/@6.6816787,3.2720243,17z/data=!4m8!3m7!1s0x103b97285a548eef:0x595158c21e2a5c5a!8m2!3d6.6816787!4d3.2720243!9m1!1b1!16s%2Fg%2F11yz8mbjcq?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D'

const GoogleG = (p) => (
  <svg viewBox="0 0 48 48" {...p}>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.5 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8.1l-6.5 5C9.9 39.5 16.4 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.3 5.3C40.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
  </svg>
)

/**
 * Reviews, in order of preference:
 *   1. Live Google Places API, once GOOGLE_PLACES_API_KEY is configured
 *      (see GOOGLE_REVIEWS_SETUP.md) — real, always current.
 *   2. Hand-picked reviews copied into src/data/testimonials.js — real,
 *      but needs manual updates.
 *   3. A plain "read our reviews on Google" link — used when neither of the
 *      above has anything, so nothing fabricated ever shows.
 *
 * Once the API key is set up, step 1 takes over automatically and the
 * manual list in step 2 quietly becomes unused — no further code changes
 * needed.
 */
export default function GoogleReviews({ compact = false }) {
  const [state, setState] = useState('loading') // loading | live | manual | link
  const [live, setLive] = useState(null)
  const trackRef = useRef(null)

  useEffect(() => {
    let alive = true
    if (!supabase) return fallThrough()

    supabase.functions
      .invoke('google-reviews')
      .then(({ data: res, error }) => {
        if (!alive) return
        if (error || !res || !res.configured || res.error || !res.reviews?.length) {
          return fallThrough()
        }
        setLive(res)
        setState('live')
      })
      .catch(() => alive && fallThrough())

    function fallThrough() {
      if (!alive) return
      setState(testimonials.length ? 'manual' : 'link')
    }

    return () => {
      alive = false
    }
  }, [])

  const mapsUrl = live?.mapsUrl || FALLBACK_MAPS_URL

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' })
  }

  if (state === 'loading') {
    return (
      <div
        className={`animate-shimmer rounded-md bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%] ${
          compact ? 'h-16' : 'h-40'
        }`}
      />
    )
  }

  if (state === 'link') {
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

  // normalize both sources into the same shape so the rest of the UI
  // doesn't need to know which one it's showing
  const reviews =
    state === 'live'
      ? live.reviews.map((r) => ({
          author: r.author,
          photo: r.photo,
          rating: r.rating,
          text: r.text,
          date: r.relativeTime,
        }))
      : testimonials

  if (compact) {
    const first = reviews[0]
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md border border-line bg-white px-4 py-3.5 transition-colors hover:border-brand-700"
      >
        <div className="flex items-center gap-2">
          <GoogleG className="h-5 w-5 shrink-0" />
          {state === 'live' && live.rating && (
            <span className="flex items-center gap-1 text-[13.5px] font-semibold">
              {live.rating.toFixed(1)}
              <Star className="h-3.5 w-3.5 fill-current text-accent" />
            </span>
          )}
          {state === 'live' && live.reviewCount && (
            <span className="text-[12.5px] text-ink-mute">({live.reviewCount} reviews)</span>
          )}
          {state === 'manual' && (
            <span className="text-[13px] font-semibold text-ink-soft">What people say</span>
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
    <div>
      {state === 'live' && (
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <GoogleG className="h-8 w-8 shrink-0" />
          {live.rating && (
            <div className="flex items-center gap-2">
              <span className="font-display text-[24px] font-semibold tracking-[-.02em]">
                {live.rating.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(live.rating) ? 'fill-current text-accent' : 'text-line'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          {live.reviewCount && (
            <span className="text-[13.5px] text-ink-soft">{live.reviewCount} Google reviews</span>
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
      )}

      <div className="relative">
        <div ref={trackRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1">
          {reviews.slice(0, 8).map((r, i) => (
            <div
              key={i}
              className="w-[260px] shrink-0 rounded-md border border-line bg-white p-4 sm:w-[300px] sm:p-5"
            >
              <div className="flex items-center gap-2.5">
                {r.photo ? (
                  <img src={r.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-wash text-[12px] font-bold text-brand-700">
                    {r.author.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-[12.5px] font-semibold">{r.author}</b>
                  {r.date && <span className="text-[11px] text-ink-mute">{r.date}</span>}
                </div>
                <GoogleG className="h-4 w-4 shrink-0 opacity-70" />
              </div>
              <div className="mt-2.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, n) => (
                  <Star
                    key={n}
                    className={`h-3 w-3 ${n < r.rating ? 'fill-current text-accent' : 'text-line'}`}
                  />
                ))}
              </div>
              {r.text && (
                <p className="mt-2 line-clamp-5 text-[12.5px] leading-relaxed text-ink-soft">
                  "{r.text}"
                </p>
              )}
            </div>
          ))}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-paper p-5 text-center transition-colors hover:border-brand-700"
          >
            <GoogleG className="h-7 w-7" />
            <span className="text-[13px] font-semibold text-brand-700">See more on Google</span>
          </a>
        </div>

        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous reviews"
          className="absolute -left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white shadow-xs transition-colors hover:border-brand-700 lg:grid"
        >
          <ChevLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="More reviews"
          className="absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white shadow-xs transition-colors hover:border-brand-700 lg:grid"
        >
          <ChevRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
