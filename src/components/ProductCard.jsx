import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bag, Heart, Check } from './Icons'
import { formatNaira, discountPct, productImage } from '../data/catalog'
import { useCart } from '../context/CartContext'

export default function ProductCard({ p, priority = false }) {
  const { add, toggleSave, isSaved } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [imgState, setImgState] = useState('loading')
  const saved = isSaved(p.id)
  const off = discountPct(p)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!p.stock) return
    add(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    if (!p.stock) return
    add(p)
    navigate('/checkout')
  }

  return (
    <article className="group/card relative flex w-full flex-col overflow-hidden rounded-md border border-line bg-white shadow-xs transition-[border-color,box-shadow,transform] duration-300 ease-smooth hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift">
      <Link
        to={`/product/${p.id}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-b from-white to-[#FAFCFE]"
        aria-label={p.name}
      >
        {imgState === 'loading' && (
          <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]" />
        )}

        {imgState === 'error' ? (
          <div className="absolute inset-0 grid place-items-center bg-paper px-4 text-center">
            <span className="text-[12.5px] font-semibold uppercase tracking-[.06em] text-ink-mute">
              {p.brand}
            </span>
          </div>
        ) : (
          <img
            src={productImage(p)}
            alt={p.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setImgState('ok')}
            onError={() => setImgState('error')}
            className={`absolute inset-0 h-full w-full object-contain p-4 transition-[opacity,transform] duration-500 ease-smooth group-hover/card:scale-[1.06] ${
              imgState === 'ok' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-sm bg-rx px-2 py-1 font-mono text-[11.5px] font-medium text-white">
            −{off}%
          </span>
        )}

        {p.pom && (
          <span className="absolute right-3 top-3 rounded-sm bg-ink/90 px-2 py-1 font-mono text-[11.5px] font-medium text-white backdrop-blur-sm">
            ℞
          </span>
        )}

        {!p.stock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/85 py-1.5 text-center text-[12.5px] font-semibold uppercase tracking-[.06em] text-white">
            Out of stock
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            toggleSave(p.id)
          }}
          aria-label={saved ? 'Remove from saved' : 'Save for later'}
          aria-pressed={saved}
          className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-line bg-white/95 backdrop-blur-sm transition-all duration-200 ${
            saved
              ? 'text-rx opacity-100'
              : 'text-ink-mute opacity-0 hover:text-rx group-hover/card:opacity-100 focus-visible:opacity-100'
          }`}
        >
          <Heart className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-3.5">
        <span className="text-[12.5px] font-semibold uppercase tracking-[.06em] text-brand-700">
          {p.brand}
        </span>

        <Link
          to={`/product/${p.id}`}
          className="line-clamp-2 min-h-[2.6em] text-[13.5px] font-medium leading-[1.3] tracking-[-.005em] transition-colors hover:text-brand-700"
        >
          {p.name}
        </Link>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-[19px] font-semibold tracking-[-.02em]">
            {formatNaira(p.price)}
          </span>
          {p.was && (
            <span className="font-mono text-[11.5px] text-ink-mute line-through">
              {formatNaira(p.was)}
            </span>
          )}
        </div>

        {p.stock ? (
          <div className="mt-1 grid grid-cols-[1fr_auto] gap-1.5">
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 rounded-sm bg-brand-700 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-800"
            >
              Buy now
            </button>
            <button
              onClick={handleAdd}
              aria-label={`Add ${p.name} to cart`}
              title="Add to cart"
              className={`grid w-11 place-items-center rounded-sm border-[1.5px] transition-all duration-200 ${
                added
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-line bg-paper hover:border-brand-700 hover:text-brand-700'
              }`}
            >
              {added ? <Check className="h-4 w-4" /> : <Bag className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <button
            disabled
            className="mt-1 w-full cursor-default rounded-sm border-[1.5px] border-line bg-paper py-2.5 text-[13px] font-bold text-ink-mute"
          >
            Notify me
          </button>
        )}
      </div>
    </article>
  )
}
