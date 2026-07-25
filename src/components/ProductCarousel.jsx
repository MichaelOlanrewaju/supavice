import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { ChevLeft, ChevRight, Arrow } from './Icons'

/**
 * Horizontal scrolling product row.
 * Arrows scroll by roughly one "page" of cards; they disable at each end.
 */
export default function ProductCarousel({
  title,
  eyebrow,
  sub,
  items,
  linkTo,
  linkLabel = 'See all',
  accent = 'brand',
}) {
  const track = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const measure = () => {
    const el = track.current
    if (!el) return
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }

  useEffect(() => {
    measure()
    const el = track.current
    if (!el) return
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [items])

  const scrollBy = (dir) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: 'smooth' })
  }

  if (!items?.length) return null

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12">
      <div className="flex justify-between items-end gap-6 mb-6 flex-wrap">
        <div>
          {eyebrow && (
            <div className={`eyebrow ${accent === 'rx' ? 'eyebrow-rx' : ''}`}>{eyebrow}</div>
          )}
          <h2 className="font-display mt-3 text-display-md">
            {title}
          </h2>
          {sub && <p className="text-[14.5px] text-ink-soft mt-2 max-w-[54ch]">{sub}</p>}
        </div>

        <div className="flex items-center gap-4">
          {linkTo && (
            <Link
              to={linkTo}
              className="text-sm font-semibold text-brand-700 flex items-center gap-2 pb-1.5 border-b-[1.5px] border-transparent hover:border-brand-700 transition-colors whitespace-nowrap"
            >
              {linkLabel} <Arrow className="w-4 h-4" />
            </Link>
          )}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full grid place-items-center bg-white border border-line hover:border-brand-700 transition-colors disabled:opacity-35 disabled:hover:border-line disabled:cursor-default"
            >
              <ChevLeft className="w-[17px] h-[17px]" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full grid place-items-center bg-white border border-line hover:border-brand-700 transition-colors disabled:opacity-35 disabled:hover:border-line disabled:cursor-default"
            >
              <ChevRight className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 pb-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="snap-start shrink-0 w-[168px] sm:w-[196px] lg:w-[212px] flex"
          >
            <ProductCard p={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
