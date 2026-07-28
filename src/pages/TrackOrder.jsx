import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/Bits'
import { Search, Check, Arrow, Truck } from '../components/Icons'
import { supabase } from '../lib/supabase'
import { formatNaira } from '../data/catalog'

const STATUS_COPY = {
  pending: 'We have your order and are confirming it now.',
  confirmed: 'Confirmed — being prepared for dispatch.',
  dispatched: 'On its way to you.',
  delivered: 'Delivered.',
  cancelled: 'This order was cancelled.',
}

const STATUS_STEPS = ['pending', 'confirmed', 'dispatched', 'delivered']

export default function TrackOrder() {
  const [email, setEmail] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [state, setState] = useState('idle') // idle | loading | found | notfound | error
  const [order, setOrder] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setState('error')
      return
    }
    setState('loading')

    const [{ data, error }, itemsRes] = await Promise.all([
      supabase.rpc('track_order', { p_order_no: orderNo.trim(), p_email: email.trim() }),
      supabase.rpc('track_order_items', { p_order_no: orderNo.trim(), p_email: email.trim() }),
    ])

    if (error || itemsRes.error) {
      setState('error')
      return
    }
    const found = data?.[0]
    if (!found) {
      setState('notfound')
      return
    }
    setOrder({ ...found, order_items: itemsRes.data || [] })
    setState('found')
  }

  return (
    <>
      <PageHead
        eyebrow="Where's my order"
        title="Track your order"
        sub="Enter the email you ordered with and your order number — it's on your confirmation, formatted like SUP-10234."
      />

      <section className="mx-auto max-w-[640px] px-6 py-section-sm">
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-md border border-line bg-white p-6 sm:p-8"
        >
          <label className="grid gap-1.5">
            <span className="text-[13.5px] font-semibold uppercase tracking-[.02em] text-ink-soft">
              Email address
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-700"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-[13.5px] font-semibold uppercase tracking-[.02em] text-ink-soft">
              Order number
            </span>
            <input
              required
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="SUP-10234"
              className="rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 font-mono text-sm outline-none focus:border-brand-700"
            />
          </label>

          <button
            type="submit"
            disabled={state === 'loading'}
            className="btn-primary mt-2 justify-center"
          >
            <Search className="h-[17px] w-[17px]" />
            {state === 'loading' ? 'Searching…' : 'Track order'}
          </button>

          {state === 'error' && (
            <p className="rounded-sm border border-rx/20 bg-rx-wash px-4 py-3 text-[13px] text-rx-700">
              Something went wrong on our end. Try again, or call{' '}
              <a href="tel:+2348138112519" className="font-semibold hover:underline">
                +234 813 811 2519
              </a>
              .
            </p>
          )}

          {state === 'notfound' && (
            <p className="rounded-sm border border-line bg-paper px-4 py-3 text-[13px] text-ink-soft">
              We couldn't find an order matching that email and order number. Double-check both, or{' '}
              <Link to="/contact" className="font-semibold text-brand-700 hover:underline">
                contact us
              </Link>{' '}
              and we'll look it up for you.
            </p>
          )}
        </form>

        {state === 'found' && order && (
          <div className="mt-6 rounded-md border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[13px] text-ink-mute">{order.order_no}</span>
                <h2 className="mt-1 font-display text-xl font-semibold">
                  {STATUS_COPY[order.status] || order.status}
                </h2>
              </div>
              <span className="font-display text-[20px] font-semibold tracking-[-.02em]">
                {formatNaira(order.subtotal)}
              </span>
            </div>

            {order.status !== 'cancelled' && (
              <div className="mt-6 flex items-center gap-2">
                {STATUS_STEPS.map((s, i) => {
                  const currentIdx = STATUS_STEPS.indexOf(order.status)
                  const done = i <= currentIdx
                  return (
                    <div key={s} className="flex flex-1 items-center gap-2">
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                          done ? 'bg-brand-700 text-white' : 'bg-paper text-ink-mute border border-line'
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      {i < STATUS_STEPS.length - 1 && (
                        <span
                          className={`h-[2px] flex-1 rounded-full ${done ? 'bg-brand-700' : 'bg-line'}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <ul className="dashed-top mt-6 grid gap-2 pt-4">
              {order.order_items?.map((it) => (
                <li key={it.id} className="flex justify-between text-[13.5px]">
                  <span className="text-ink-soft">
                    {it.qty} × {it.name}
                  </span>
                  <span className="font-medium">{formatNaira(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center gap-2 text-[13px] text-ink-soft">
              <Truck className="h-4 w-4 shrink-0" />
              {order.method === 'pickup'
                ? 'Collection from our Alakuko store.'
                : 'Delivery — cost confirmed separately by phone.'}
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-[13.5px] text-ink-soft">
          Can't find it?{' '}
          <Link to="/contact" className="font-semibold text-brand-700 hover:underline">
            Message us
          </Link>{' '}
          with your order number and we'll sort it out.
        </p>
      </section>
    </>
  )
}
