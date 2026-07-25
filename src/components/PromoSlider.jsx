import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { banners, formatNaira, products } from '../data/catalog'
import { Arrow, ChevLeft, ChevRight } from './Icons'

const DURATION = 6500

export default function PromoSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loaded, setLoaded] = useState({})
  const touchX = useRef(null)

  const go = useCallback((n) => setI((n + banners.length) % banners.length), [])
  const next = useCallback(() => go(i + 1), [i, go])
  const prev = useCallback(() => go(i - 1), [i, go])

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

  /* Real starting price for whatever this banner links to, rather than a
     hardcoded number that could drift out of sync with the catalogue. */
  const catSlug = new URLSearchParams(b.to.split('?')[1] || '').get('cat')
  const pool = catSlug ? products.filter((x) => x.category === catSlug && x.stock) : []
  const fromPrice = pool.length ? Math.min(...pool.map((x) => x.price)) : null

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-6 pb-2">
      <div className="grid lg:grid-cols-[1fr_292px] gap-4">
        {/* ---------- main slider ---------- */}
        <div
          className="relative rounded-lg overflow-hidden bg-ink group/slider"
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
          {/* stacked slides — all mounted, only the active one visible, so images never re-request */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[1240/620]">
            {banners.map((bn, n) => (
              <div
                key={bn.id}
                aria-hidden={n !== i}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  n === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet={bn.image.replace('.jpg', '-sm.webp')}
                    type="image/webp"
                  />
                  <source srcSet={bn.image.replace('.jpg', '.webp')} type="image/webp" />
                  <img
                    src={bn.image}
                    alt=""
                    width="1280"
                    height="689"
                    loading={n === 0 ? 'eager' : 'lazy'}
                    fetchPriority={n === 0 ? 'high' : 'low'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </picture>
                {/* scrim: strongest on the text side, clear over the product shot */}
                <div
                  className={`absolute inset-0 ${
                    bn.align === 'right'
                      ? 'bg-gradient-to-l from-black/80 via-black/45 to-transparent'
                      : 'bg-gradient-to-r from-black/80 via-black/45 to-transparent'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ))}

            {/* skeleton while the first image loads */}
            {!loaded[b.id] && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#12395E] to-[#0A2540] animate-pulse" />
            )}

            {/* ---------- copy ---------- */}
            <div
              className={`absolute inset-0 flex items-center ${
                alignRight ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                key={b.id}
                className={`w-full max-w-[560px] px-7 sm:px-10 lg:px-12 py-8 animate-fadeUp ${
                  alignRight ? 'text-right items-end' : 'text-left items-start'
                } flex flex-col`}
              >
                {b.badge && (
                  <span className="inline-flex items-center gap-2 bg-rx text-white font-mono text-[11.5px] sm:text-[11px] tracking-[.12em] uppercase px-3 py-1.5 rounded-sm mb-4 w-fit">
                    {b.badge}
                  </span>
                )}

                <span className="font-mono text-[11.5px] sm:text-[11px] tracking-[.16em] uppercase text-white/75 mb-2.5">
                  {b.kicker}
                </span>

                <h2 className="font-display font-semibold leading-[1] tracking-[-.03em] text-white text-[clamp(28px,5vw,54px)] drop-shadow-lg">
                  {b.title}{' '}
                  <span className="text-accent block sm:inline">{b.titleAccent}</span>
                </h2>

                <p className="text-white/85 text-[13px] sm:text-[15px] leading-[1.5] max-w-[42ch] mt-3 hidden sm:block drop-shadow">
                  {b.body}
                </p>

                {fromPrice !== null && (
                  <div
                    className={`mt-4 flex items-baseline gap-2.5 ${alignRight ? 'justify-end' : ''}`}
                  >
                    <span className="font-mono text-[11.5px] uppercase tracking-[.1em] text-white/60">
                      From
                    </span>
                    <span className="font-display text-[22px] font-semibold text-white sm:text-[27px]">
                      {formatNaira(fromPrice)}
                    </span>
                  </div>
                )}

                {/* ---------- CTAs ---------- */}
                <div className={`flex gap-2.5 mt-6 flex-wrap ${alignRight ? 'justify-end' : ''}`}>
                  <Link
                    to={b.to}
                    className="inline-flex items-center gap-2.5 bg-rx-600 text-[#FFFFFF] font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-sm text-[14px] sm:text-[15px] shadow-[0_3px_0_#B80000] hover:translate-y-[1.5px] hover:shadow-[0_1.5px_0_#B80000] transition-all"
                  >
                    {b.cta}
                    <Arrow className="w-[16px] h-[16px]" />
                  </Link>
                  {b.ctaSecondary && (
                    <Link
                      to={b.toSecondary}
                      className="hidden sm:inline-flex items-center gap-2 border-[1.5px] border-white/40 text-white font-semibold px-6 py-3.5 rounded-sm text-[15px] backdrop-blur-sm hover:bg-white/10 hover:border-white transition-colors"
                    >
                      {b.ctaSecondary}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* ---------- arrows ---------- */}
            <button
              onClick={prev}
              aria-label="Previous offer"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full grid place-items-center bg-black/30 text-white hover:bg-black/55 transition-colors backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 focus-visible:opacity-100"
            >
              <ChevLeft className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={next}
              aria-label="Next offer"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full grid place-items-center bg-black/30 text-white hover:bg-black/55 transition-colors backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 focus-visible:opacity-100"
            >
              <ChevRight className="w-[18px] h-[18px]" />
            </button>

            {/* ---------- progress dots ---------- */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {banners.map((bn, n) => (
                <button
                  key={bn.id}
                  onClick={() => go(n)}
                  aria-label={`Go to offer ${n + 1}`}
                  aria-current={n === i}
                  className="h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                  style={{
                    width: n === i ? 38 : 8,
                    background: n === i ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.45)',
                  }}
                >
                  {n === i && (
                    <span
                      key={`${bn.id}-bar`}
                      className="block h-full bg-white rounded-full"
                      style={{
                        animation: paused ? 'none' : `slideProgress ${DURATION}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- side promos ---------- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <Link
            to="/shop?filter=value"
            className="relative overflow-hidden bg-rx text-white rounded-md p-6 flex flex-col justify-between hover:brightness-110 transition-all group min-h-[150px]"
          >
            <div className="relative">
              <span className="font-mono text-[11.5px] tracking-[.13em] uppercase opacity-80">
                Always on
              </span>
              <h3 className="font-display text-[26px] font-semibold leading-tight mt-2">
                Best value
              </h3>
              <p className="text-white/80 text-[13px] mt-2 max-w-[26ch]">
                The lowest price we stock in every aisle.
              </p>
            </div>
            <span className="relative font-mono text-[11px] tracking-[.09em] uppercase mt-5 flex items-center gap-2">
              Shop now
              <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/shop"
            className="relative overflow-hidden bg-white border border-line rounded-md p-6 flex flex-col justify-between hover:border-brand-700 transition-colors group min-h-[150px]"
          >
            <div className="relative">
              <span className="font-mono text-[11.5px] tracking-[.13em] uppercase text-brand-700">
                Every day
              </span>
              <h3 className="font-display text-[26px] font-semibold leading-tight mt-2">
                Same-day Lagos
              </h3>
              <p className="text-ink-soft text-[13px] mt-2 max-w-[28ch]">
                Order before 16:00 and most Lagos deliveries arrive the same day.
              </p>
            </div>
            <span className="relative font-mono text-[11px] tracking-[.09em] uppercase text-brand-700 mt-5 flex items-center gap-2">
              See offers
              <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
