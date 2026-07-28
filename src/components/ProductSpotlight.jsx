import { Link } from 'react-router-dom'
import { Bag, Arrow, Check } from './Icons'
import { formatNaira, productImage } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Editorial spotlight: one large hero product beside a stacked list of
 * supporting picks. Breaks up the rhythm of full-width carousels.
 */
export default function ProductSpotlight({ eyebrow, title, sub, hero, picks = [], tone = 'light' }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  if (!hero) return null

  const dark = tone === 'dark'

  const handleAdd = () => {
    add(hero)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    add(hero)
    navigate('/checkout')
  }

  return (
    <section
      className={`py-section-sm ${dark ? 'bg-ink text-white' : 'border-y border-line bg-white'}`}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-8 max-w-[46ch]">
          <div className={`eyebrow ${dark ? 'eyebrow-accent' : ''}`}>{eyebrow}</div>
          <h2 className={`mt-3 font-display text-display-md ${dark ? 'text-white' : ''}`}>
            {title}
          </h2>
          {sub && (
            <p className={`mt-3 text-[15px] ${dark ? 'text-[#A8BDD0]' : 'text-ink-soft'}`}>{sub}</p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* ---- hero product ---- */}
          <article
            className={`group relative overflow-hidden rounded-lg border transition-colors duration-300 ${
              dark ? 'border-white/15 bg-white/[.04]' : 'border-line bg-paper'
            }`}
          >
            <div className="grid h-full sm:grid-cols-2">
              <Link
                to={`/product/${hero.id}`}
                className="relative aspect-square overflow-hidden bg-white sm:aspect-auto"
              >
                <img
                  src={productImage(hero)}
                  alt={hero.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-700 ease-smooth group-hover:scale-[1.06]"
                  onError={(e) => (e.currentTarget.style.opacity = 0)}
                />
              </Link>

              <div className="flex flex-col justify-center gap-3 p-7 lg:p-9">
                <span className="text-[12.5px] font-semibold uppercase tracking-[.06em] text-brand">
                  {hero.brand}
                </span>
                <Link
                  to={`/product/${hero.id}`}
                  className={`font-display text-[clamp(20px,2.4vw,29px)] font-semibold leading-[1.1] tracking-[-.028em] transition-colors ${
                    dark ? 'text-white hover:text-brand' : 'hover:text-brand-700'
                  }`}
                >
                  {hero.name}
                </Link>

                {hero.pack && (
                  <span
                    className={`w-fit rounded-sm border px-2.5 py-1 font-mono text-[11.5px] uppercase tracking-[.08em] ${
                      dark ? 'border-white/20 text-[#A8BDD0]' : 'border-line text-ink-soft'
                    }`}
                  >
                    {hero.pack}
                  </span>
                )}

                <div className="mt-2 flex items-baseline gap-3">
                  <span
                    className={`font-display text-[30px] font-semibold tracking-[-.03em] ${
                      dark ? 'text-white' : ''
                    }`}
                  >
                    {formatNaira(hero.price)}
                  </span>
                  {hero.was && (
                    <span className="font-mono text-[13px] text-ink-mute line-through">
                      {formatNaira(hero.was)}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2.5">
                  <button onClick={handleBuyNow} className="btn-primary">
                    Buy now
                    <Arrow className="h-[17px] w-[17px]" />
                  </button>
                  <button
                    onClick={handleAdd}
                    className={`btn-ghost ${dark ? 'border-white/25 bg-transparent text-white hover:border-white hover:text-white' : ''} ${added ? '!border-brand-700 !bg-brand-700 !text-white' : ''}`}
                  >
                    {added ? (
                      <>
                        <Check className="h-[17px] w-[17px]" /> Added
                      </>
                    ) : (
                      <>
                        <Bag className="h-[17px] w-[17px]" /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* ---- supporting picks ---- */}
          <div
            className={`grid gap-px overflow-hidden rounded-lg border ${
              dark ? 'border-white/15 bg-white/10' : 'border-line bg-line'
            }`}
          >
            {picks.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className={`group/row flex items-center gap-4 px-5 py-4 transition-colors ${
                  dark ? 'bg-ink hover:bg-white/[.06]' : 'bg-white hover:bg-paper'
                }`}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-white">
                  <img
                    src={productImage(p)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover/row:scale-110"
                    onError={(e) => (e.currentTarget.style.opacity = 0)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[.06em] text-brand-700">
                    {p.brand}
                  </span>
                  <b
                    className={`line-clamp-2 text-[13px] font-medium leading-[1.32] ${
                      dark ? 'text-white' : ''
                    }`}
                  >
                    {p.name}
                  </b>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`block font-display text-[15px] font-semibold tracking-[-.02em] ${
                      dark ? 'text-white' : ''
                    }`}
                  >
                    {formatNaira(p.price)}
                  </span>
                  <Arrow
                    className={`ml-auto mt-1 h-3.5 w-3.5 transition-transform group-hover/row:translate-x-1 ${
                      dark ? 'text-brand' : 'text-brand-700'
                    }`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
