import { Link } from 'react-router-dom'
import { Arrow } from './Icons'

/**
 * Asymmetric category mosaic — one large tile plus a grid of smaller ones.
 * Deliberately breaks the uniform-grid rhythm used higher up the page.
 */
export default function CategoryMosaic({ eyebrow, title, sub, feature, tiles = [] }) {
  if (!feature) return null

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[46ch]">
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="mt-3 font-display text-display-md">{title}</h2>
          {sub && <p className="mt-3 text-[15px] text-ink-soft">{sub}</p>}
        </div>
        <Link
          to="/shop"
          className="flex items-center gap-2 whitespace-nowrap border-b-[1.5px] border-transparent pb-1.5 text-sm font-bold text-brand-700 transition-colors hover:border-brand-700"
        >
          All categories <Arrow className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_2fr]">
        {/* ---- large feature tile ---- */}
        <Link
          to={`/shop?cat=${feature.slug}`}
          className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-lg border border-line bg-gradient-to-br from-brand-800 to-ink p-8 text-white transition-all duration-300 ease-smooth hover:shadow-lift"
        >
          {feature.image && (
            <img
              src={feature.image}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute -right-6 top-6 h-44 w-44 object-contain opacity-90 transition-transform duration-700 ease-smooth group-hover:scale-110 group-hover:-rotate-3"
              onError={(e) => (e.currentTarget.style.opacity = 0)}
            />
          )}
          <div className="relative">
            <span className="font-mono text-[11.5px] uppercase tracking-[.14em] text-brand">
              Featured category
            </span>
            <h3 className="mt-2 font-display text-[clamp(26px,3vw,36px)] font-semibold leading-[1.05] tracking-[-.03em]">
              {feature.name}
            </h3>
            <span className="mt-5 inline-flex items-center gap-2 rounded-sm bg-white px-5 py-2.5 text-[13px] font-bold text-ink transition-colors group-hover:bg-brand group-hover:text-white">
              Shop now
              <Arrow className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* ---- supporting tiles ---- */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tiles.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              to={`/shop?cat=${c.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-line bg-white transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand/60 hover:shadow-card"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-paper">
                {c.image && (
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain p-3.5 transition-transform duration-500 ease-smooth group-hover:scale-[1.1]"
                    onError={(e) => (e.currentTarget.style.opacity = 0)}
                  />
                )}
              </div>
              <div className="flex flex-1 items-center border-t border-line px-3.5 py-3">
                <b className="text-[13.5px] font-semibold leading-tight tracking-[-.01em]">
                  {c.name}
                </b>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
