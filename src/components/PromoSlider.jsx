import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { banners, formatNaira, fetchProducts } from '../data/catalog'
import { Arrow, ChevLeft, ChevRight } from './Icons'

const DURATION = 4000

export default function PromoSlider() {
  const [i, setI] = useState(0)
  const [products, setProducts] = useState([])
  const [paused, setPaused] = useState(false)
  const [loaded, setLoaded] = useState({})
  const touchX = useRef(null)

  const go = useCallback((n) => setI((n + banners.length) % banners.length), [])
  const next = useCallback(() => go(i + 1), [i, go])
  const prev = useCallback(() => go(i - 1), [i, go])

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  /* preload every banner so slide changes never flash an empty box */
  useEffect(() => {
    banners.forEach((b) => {
      const img = new Image()
      img.onload = () => setLoaded((s) => ({ ...s, [b.id]: true }))
      img.src = window.innerWidth <= 640
        ? b.image.replace('.jpg', '-sm.webp')
        : b.image.replace('.jpg', '.webp')
    })
  }, [])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(next, DURATION)
    return () => clearTimeout(t)
  }, [i, paused, next])

  const b = banners[i]
  const alignRight = b.align === 'right'

  /* Real starting price for whatever this banner is about, rather than a
     hardcoded number that could drift out of sync with the catalogue. */
  const pool = b.cat ? products.filter((x) => x.category === b.cat && x.stock) : []
  const fromPrice = pool.length ? Math.min(...pool.map((x) => x.price)) : null

  const Copy = ({ compact = false }) => (
    <div
      key={b.id + (compact ? '-m' : '-d')}
      className={`flex flex-col animate-fadeUp ${
        compact ? 'items-start text-left' : alignRight ? 'items-end text-right' : 'items-start text-left'
      }`}
    >
      {b.badge && (
        <span className="mb-3 w-fit rounded-sm bg-rx px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.12em] text-white">
          {b.badge}
        </span>
      )}

      <span
        className={`mb-2.5 font-mono text-[11px] uppercase tracking-[.16em] ${
          compact ? 'text-ink-mute' : 'text-white/75'
        }`}
      >
        {b.kicker}
      </span>

      <h2
        className={`font-display font-semibold leading-[1.05] tracking-[-.03em] ${
          compact ? 'text-[clamp(24px,7vw,32px)] text-ink' : 'text-[clamp(28px,5vw,54px)] text-white drop-shadow-lg'
        }`}
      >
        {b.title}{' '}
        <span className={compact ? 'text-brand-700' : 'text-accent'}>{b.titleAccent}</span>
      </h2>

      <p
        className={`mt-3 max-w-[42ch] text-[14.5px] leading-[1.55] ${
          compact ? 'text-ink-soft' : 'text-white/85 drop-shadow'
        }`}
      >
        {b.body}
      </p>

      {fromPrice !== null && (
        <div className={`mt-4 flex items-baseline gap-2.5 ${!compact && alignRight ? 'justify-end' : ''}`}>
          <span
            className={`font-mono text-[11px] uppercase tracking-[.1em] ${
              compact ? 'text-ink-mute' : 'text-white/60'
            }`}
          >
            From
          </span>
          <span
            className={`font-display text-[22px] font-semibold sm:text-[27px] ${
              compact ? 'text-ink' : 'text-white'
            }`}
          >
            {formatNaira(fromPrice)}
          </span>
        </div>
      )}

      <div className={`mt-6 flex flex-wrap gap-2.5 ${!compact && alignRight ? 'justify-end' : ''}`}>
        <Link
          to={b.to}
          className="inline-flex items-center gap-2.5 rounded-sm bg-rx-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_3px_0_#A11010] transition-all hover:translate-y-[1.5px] hover:shadow-[0_1.5px_0_#A11010] sm:px-7 sm:py-3.5 sm:text-[15px]"
        >
          {b.cta}
          <Arrow className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )

  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-2 pt-6">
      {/* ---------- main slider ---------- */}
      <div
          className="group/slider overflow-hidden rounded-lg bg-white"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const d = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(d) > 55) (d < 0 ? next : prev)()
            touchX.current = null
          }}
          aria-roledescription="carousel"
          aria-label="Featured offers"
        >
          {/* ---- image: full, uncropped, at its real ratio, every breakpoint ---- */}
          <div className="relative aspect-[1280/689] overflow-hidden rounded-lg bg-gradient-to-br from-brand-800 to-ink sm:rounded-lg">
            {banners.map((bn, n) => (
              <div
                key={bn.id}
                aria-hidden={n !== i}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  n === i ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <picture>
                  <source media="(max-width: 640px)" srcSet={bn.image.replace('.jpg', '-sm.webp')} type="image/webp" />
                  <source srcSet={bn.image.replace('.jpg', '.webp')} type="image/webp" />
                  <img
                    src={bn.image}
                    alt=""
                    width="1280"
                    height="689"
                    loading={n === 0 ? 'eager' : 'lazy'}
                    fetchPriority={n === 0 ? 'high' : 'low'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </picture>
                {/* scrim for the overlay text — desktop/tablet only, since mobile
                    shows the image plain with text in its own panel below */}
                <div
                  className={`absolute inset-0 hidden sm:block ${
                    bn.align === 'right'
                      ? 'bg-gradient-to-l from-black/70 via-black/35 to-transparent'
                      : 'bg-gradient-to-r from-black/70 via-black/35 to-transparent'
                  }`}
                />
              </div>
            ))}

            {!loaded[b.id] && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#12395E] to-[#0A2540]" />
            )}

            {/* ---- overlay copy: sm and up only ---- */}
            <div className={`absolute inset-0 hidden items-center sm:flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
              <div className="w-full max-w-[560px] px-8 py-8 lg:px-12">
                <Copy />
              </div>
            </div>

            {/* ---- arrows ---- */}
            <button
              onClick={prev}
              aria-label="Previous offer"
              className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white opacity-70 backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:opacity-100 group-hover/slider:opacity-100 sm:h-11 sm:w-11 sm:opacity-0"
            >
              <ChevLeft className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={next}
              aria-label="Next offer"
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white opacity-70 backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:opacity-100 group-hover/slider:opacity-100 sm:h-11 sm:w-11 sm:opacity-0"
            >
              <ChevRight className="h-[18px] w-[18px]" />
            </button>

            {/* ---- progress dots ---- */}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {banners.map((bn, n) => (
                <button
                  key={bn.id}
                  onClick={() => go(n)}
                  aria-label={`Go to offer ${n + 1}`}
                  aria-current={n === i}
                  className="h-1.5 overflow-hidden rounded-full transition-all duration-300"
                  style={{
                    width: n === i ? 38 : 8,
                    background: n === i ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.45)',
                  }}
                >
                  {n === i && (
                    <span
                      key={`${bn.id}-bar`}
                      className="block h-full rounded-full bg-white"
                      style={{ animation: paused ? 'none' : `slideProgress ${DURATION}ms linear forwards` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ---- mobile-only copy panel, below the full image ---- */}
          <div className="border-t border-line px-6 py-6 sm:hidden">
            <Copy compact />
          </div>
        </div>
    </section>
  )
}
