import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { SectionHead } from '../components/Bits'
import { Bag, Doc, Heart, Check, Truck, Pin, Arrow } from '../components/Icons'
import { fetchProduct, fetchRelated, formatNaira, productImage, loadDescription } from '../data/catalog'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const { add, toggleSave, isSaved } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [desc, setDesc] = useState([])
  const [added, setAdded] = useState(false)

  const [p, setP] = useState(null)
  const [pLoading, setPLoading] = useState(true)
  const [related, setRelated] = useState([])

  useEffect(() => {
    let live = true
    setPLoading(true)
    setP(null)
    setRelated([])
    fetchProduct(id).then((prod) => {
      if (!live) return
      setP(prod)
      setPLoading(false)
      if (prod) fetchRelated(prod, 6).then((r) => live && setRelated(r))
    })
    return () => {
      live = false
    }
  }, [id])

  useEffect(() => {
    let live = true
    setDesc([])
    setShowAll(false)
    if (id) loadDescription(id).then((d) => live && setDesc(d))
    return () => {
      live = false
    }
  }, [id])

  if (pLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="h-6 w-40 animate-shimmer rounded-sm bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]" />
      </div>
    )
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold mb-3">We don't stock that</h1>
        <p className="text-ink-soft mb-6">The product may have been delisted or the link is wrong.</p>
        <Link to="/" className="btn-primary">
          Back to the shop
        </Link>
      </div>
    )
  }

  const off = p.was ? Math.round(((p.was - p.price) / p.was) * 100) : 0
  const saved = isSaved(p.id)

  const handleBuyNow = () => {
    add(p, qty)
    navigate('/checkout')
  }

  const handleAdd = () => {
    add(p, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-4 font-mono text-[11px] tracking-[.08em] uppercase text-ink-soft flex gap-2 flex-wrap">
          <Link to="/" className="hover:text-brand-700">
            Home
          </Link>
          <span>/</span>
          <Link to="/" className="hover:text-brand-700">
            Shop
          </Link>
          <span>/</span>
          <Link to={"/"} className="hover:text-brand-700">
            {p.category}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-md border border-line bg-white">
              <img
                src={productImage(p)}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-contain p-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {off > 0 && (
                <span className="absolute top-5 left-5 bg-rx text-white font-mono text-xs px-3 py-1.5 rounded-sm">
                  −{off}% off
                </span>
              )}
              {p.pom && (
                <span className="absolute top-5 left-5 bg-ink text-white font-mono text-xs px-3 py-1.5 rounded-sm">
                  ℞ Prescription only
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-sm border border-line bg-white px-4 py-3">
              <span className="text-[12.5px] font-semibold uppercase tracking-[.06em] text-ink-mute">
                SKU
              </span>
              <span className="font-mono text-[12px] text-ink-soft">{p.sku || '—'}</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] tracking-[.13em] uppercase text-ink-soft mb-3">
              {p.brand}
            </div>
            <h1 className="font-display text-display-md font-semibold tracking-[-.024em] leading-[1.1]">
              {p.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {p.pack && (
                <span className="rounded-sm border border-line bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.08em]">
                  {p.pack}
                </span>
              )}
              <span className="rounded-sm border border-line bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.08em]">
                {p.rawCategory}
              </span>
              {p.pom && (
                <span className="rounded-sm bg-rx px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.08em] text-white">
                  ℞ Prescription only
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mt-5 pb-5 border-b border-line">
              <span className="font-display text-[34px] font-semibold tracking-[-.02em]">
                {formatNaira(p.price)}
              </span>
              {p.was && (
                <span className="text-lg text-ink-soft line-through">{formatNaira(p.was)}</span>
              )}
              {off > 0 && (
                <span className="font-mono text-xs text-rx bg-rx/10 px-2.5 py-1 rounded-sm">
                  Save {formatNaira(p.was - p.price)}
                </span>
              )}
            </div>

            {desc.length > 0 && (
              <div className="my-6">
                <h2 className="mb-3 text-[12.5px] font-semibold uppercase tracking-[.06em] text-ink-mute">
                  About this product
                </h2>
                <div className="space-y-3">
                  {(showAll ? desc : desc.slice(0, 2)).map((para, n) => (
                    <p key={n} className="text-[15px] leading-[1.7] text-ink-soft">
                      {para}
                    </p>
                  ))}
                </div>
                {desc.length > 2 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-3 font-mono text-[11px] uppercase tracking-[.09em] font-medium text-brand-700 hover:underline"
                  >
                    {showAll ? 'Show less' : `Read more (${desc.length - 2} more)`}
                  </button>
                )}
              </div>
            )}

            {p.pom && (
              <div className="bg-ink text-paper rounded-md p-5 mb-6">
                <h3 className="font-display text-lg font-semibold mb-2">
                  ℞ This needs a prescription
                </h3>
                <p className="text-[#B3C4D4] text-sm leading-relaxed mb-4">
                  Add it to your cart and upload your script at checkout. A pharmacist checks the
                  dose against your details before anything is dispensed. Nothing is charged until
                  they approve it.
                </p>
                <Link to="/contact" className="font-mono text-[11px] tracking-[.09em] uppercase text-accent font-medium">
                  How it works <Arrow className="ml-1.5 inline h-3.5 w-3.5 align-[-2px]" />
                </Link>
              </div>
            )}

            {p.stock ? (
              <div className="flex gap-3 flex-wrap items-stretch">
                <div className="flex items-center border-[1.5px] border-line rounded-sm bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-3.5 text-lg hover:text-brand-700"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-mono text-sm w-9 text-center" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-4 py-3.5 text-lg hover:text-brand-700"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button onClick={handleBuyNow} className="btn-primary flex-1 justify-center">
                  Buy now
                  <Arrow className="h-[17px] w-[17px]" />
                </button>
                <button
                  onClick={handleAdd}
                  className={`btn-ghost justify-center px-5 ${
                    added ? '!border-brand-700 !bg-brand-700 !text-white' : ''
                  }`}
                  title="Add to cart"
                >
                  {added ? (
                    <>
                      <Check className="h-[17px] w-[17px]" /> Added
                    </>
                  ) : p.pom ? (
                    <>
                      <Doc className="h-[17px] w-[17px]" /> Add (℞)
                    </>
                  ) : (
                    <>
                      <Bag className="h-[17px] w-[17px]" /> Add
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleSave(p.id)}
                  aria-pressed={saved}
                  className={`btn-ghost px-5 ${saved ? '!border-rx !text-rx' : ''}`}
                  aria-label="Save for later"
                >
                  <Heart className="w-[18px] h-[18px]" fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            ) : (
              <div className="border-[1.5px] border-dashed border-line rounded-md p-5 text-center">
                <p className="font-semibold mb-1">Out of stock</p>
                <p className="text-sm text-ink-soft mb-4">
                  Leave your email and we message you the moment it is back on the shelf.
                </p>
                <button className="btn-ghost w-full justify-center">Notify me when back</button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3 mt-7">
              <div className="flex gap-3 items-start border border-line rounded-md p-4 bg-white">
                <Truck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <b className="text-sm font-semibold block">Same-day in Lagos</b>
                  <span className="text-[12.5px] text-ink-soft">
                    Order before 16:00. Delivery quoted on confirmation.
                  </span>
                </div>
              </div>
              <div className="flex gap-3 items-start border border-line rounded-md p-4 bg-white">
                <Pin className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <b className="text-sm font-semibold block">Collect in store</b>
                  <span className="text-[12.5px] text-ink-soft">
                    Our Alakuko store. Held for 72 hours.
                  </span>
                </div>
              </div>
            </div>

            <dl className="mt-7 border-t border-line pt-6">
              {[
                ['Brand', p.brand],
                ['Category', p.rawCategory],
                ['Classification', p.pom ? 'Prescription only medicine (POM)' : 'Over the counter'],
                ['SKU', p.sku || '—'],
                ['Availability', p.stock ? 'In stock' : 'Out of stock'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5 text-sm dashed-top first:border-t-0">
                  <dt className="font-mono text-[11.5px] tracking-[.1em] uppercase text-ink-soft pt-1">
                    {k}
                  </dt>
                  <dd className="font-medium text-right capitalize">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-14 border-t border-line">
            <SectionHead
              eyebrow="Same shelf"
              title="Often bought alongside"
              linkTo={"/"}
              linkLabel="See the category"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* sticky mobile buy bar */}
      {p.stock && (
        <div
          className="fixed inset-x-0 bottom-16 z-30 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-lg lg:hidden"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
        >
          <div className="shrink-0">
            <p className="font-mono text-[11.5px] uppercase tracking-[.1em] text-ink-mute">Price</p>
            <p className="font-display text-[19px] font-semibold leading-none tracking-[-.02em]">
              {formatNaira(p.price)}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-sm border-[1.5px] transition-colors ${
              added ? 'border-brand-700 bg-brand-700 text-white' : 'border-line'
            }`}
            aria-label="Add to cart"
          >
            {added ? <Check className="h-5 w-5" /> : <Bag className="h-5 w-5" />}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-brand-700 text-[15px] font-bold text-white"
          >
            Buy now
            <Arrow className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}
    </>
  )
}
