import { Link } from 'react-router-dom'
import { PageHead } from '../components/Bits'
import { Bag, Close, Arrow, Doc } from '../components/Icons'
import { formatNaira } from '../data/catalog'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, setQty, remove, clear, subtotal, total, hasPom } = useCart()

  if (items.length === 0) {
    return (
      <>
        <PageHead eyebrow="Your basket" title="Nothing in here yet" />
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <Bag className="w-10 h-10 mx-auto text-ink-mute mb-5" />
          <p className="text-ink-soft max-w-[40ch] mx-auto mb-7">
Browse the shelves and add something. Same-day delivery across Lagos on orders placed before 16:00.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/" className="btn-primary">
              Start shopping
              <Arrow className="w-[17px] h-[17px]" />
            </Link>
            <Link to="/" className="btn-ghost">
              Best value picks
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead
        eyebrow="Your basket"
        title={`${items.length} ${items.length === 1 ? 'item' : 'items'} ready to go`}
      />

      <section className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div>
            <div className="border border-line rounded-md bg-white overflow-hidden">
              {items.map((i, idx) => (
                <div
                  key={i.id}
                  className={`flex gap-4 p-5 ${idx > 0 ? 'border-t border-line' : ''}`}
                >
                  <Link
                    to={`/product/${i.id}`}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-line bg-white"
                  >
                    <img
                      src={i.image}
                      alt=""
                      className="h-full w-full object-contain p-1.5"
                      onError={(e) => (e.currentTarget.style.opacity = 0)}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-mono text-[11.5px] tracking-[.11em] uppercase text-ink-soft">
                          {i.brand}
                        </span>
                        <Link
                          to={`/product/${i.id}`}
                          className="block font-semibold text-[14.5px] leading-snug mt-0.5 hover:text-brand-700 transition-colors"
                        >
                          {i.name}
                        </Link>
                        {i.pom && (
                          <span className="inline-block mt-2 font-mono text-[11.5px] tracking-[.08em] uppercase bg-ink text-white px-2 py-0.5 rounded-sm">
                            ℞ Needs a script
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => remove(i.id)}
                        aria-label={`Remove ${i.name}`}
                        className="text-ink-mute hover:text-rx transition-colors shrink-0 h-fit"
                      >
                        <Close className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center border-[1.5px] border-line rounded-sm">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="px-3 py-1.5 hover:text-brand-700"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-mono text-[13px] w-8 text-center">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="px-3 py-1.5 hover:text-brand-700"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display text-[17px] font-semibold tracking-[-.015em]">
                        {formatNaira(i.price * i.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
              <Link to="/" className="text-sm font-semibold text-brand-700 hover:underline">
                ← Keep shopping
              </Link>
              <button
                onClick={clear}
                className="text-[13px] text-ink-soft hover:text-rx transition-colors"
              >
                Empty the basket
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[150px] grid gap-4">
            <div className="border border-line rounded-md bg-white p-6">
              <h2 className="font-display text-xl font-semibold tracking-[-.015em] mb-4">
                Order summary
              </h2>
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-medium">{formatNaira(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Delivery</dt>
                  <dd className="text-[13px] font-medium text-ink-soft">Quoted separately</dd>
                </div>
                <p className="rounded-sm border border-line bg-paper px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                  We confirm your delivery cost by phone or message once the order is placed. It is
                  not charged here.
                </p>
                <div className="flex justify-between pt-3 dashed-top">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display text-[22px] font-semibold tracking-[-.02em]">
                    {formatNaira(total)}
                  </dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn-primary w-full justify-center mt-5">
                {hasPom ? (
                  <>
                    <Doc className="w-[17px] h-[17px]" /> Checkout with script
                  </>
                ) : (
                  <>
                    Checkout <Arrow className="w-[17px] h-[17px]" />
                  </>
                )}
              </Link>
              <p className="text-[12px] text-ink-soft text-center mt-3">
                Card, transfer, USSD, or cash on delivery in Lagos.
              </p>
            </div>

            {hasPom && (
              <div className="bg-ink text-paper rounded-md p-6">
                <h3 className="font-display text-lg font-semibold mb-2">
                  ℞ One or more items need a script
                </h3>
                <p className="text-[#B3C4D4] text-[13.5px] leading-[1.55]">
                  You will upload it on the next step. A pharmacist reviews it and confirms the price
                  before your card is charged — nothing is dispensed until you approve.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
