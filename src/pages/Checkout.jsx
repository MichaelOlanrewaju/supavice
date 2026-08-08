import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Arrow, Check, Doc, Lock, Truck, Pin } from '../components/Icons'
import { formatNaira } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import GoogleReviews from '../components/GoogleReviews'

const steps = ['Delivery', 'Payment', 'Review']

/* Polls for window.PaystackPop rather than assuming it's missing the
   instant someone clicks — the script loads from js.paystack.co and can
   still be in flight, particularly on a slow connection. */
function waitForPaystack(timeoutMs) {
  return new Promise((resolve) => {
    if (typeof window.PaystackPop !== 'undefined') return resolve(true)
    const start = Date.now()
    const t = setInterval(() => {
      if (typeof window.PaystackPop !== 'undefined') {
        clearInterval(t)
        resolve(true)
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(t)
        resolve(false)
      }
    }, 100)
  })
}

/* All three channels below run through Paystack — no separate cash or
   pay-on-delivery option. Paystack's own checkout lets the customer pick
   card, transfer, or USSD at the point of payment. */
const payMethods = [
  { id: 'card', label: 'Card', note: 'Visa, Mastercard, Verve — via Paystack' },
  { id: 'transfer', label: 'Bank transfer', note: 'Instant transfer — via Paystack' },
  { id: 'ussd', label: 'USSD', note: 'Dial a code from your phone — via Paystack' },
]

export default function Checkout() {
  const { items, subtotal, total, hasPom, clear } = useCart()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const orderNoFallback = 'SUP-' + Math.floor(10000 + Math.random() * 89999)
  const [placedNo, setPlacedNo] = useState(null)
  const [paidOk, setPaidOk] = useState(null) // null = pickup/no-payment path, true/false = payment attempted
  const orderNo = placedNo || orderNoFallback
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    method: 'delivery',
    pay: 'card',
    note: '',
    script: null,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  /* Signed-in customers should not retype what we already hold. */
  useEffect(() => {
    if (!profile && !user) return
    setForm((f) => ({
      ...f,
      name: f.name || profile?.full_name || '',
      phone: f.phone || profile?.phone || '',
      email: f.email || user?.email || '',
      address: f.address || profile?.address || '',
      area: f.area || profile?.area || '',
    }))
  }, [profile, user])

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold mb-3">Your cart is empty</h1>
        <p className="text-ink-soft mb-6">Add something before checking out.</p>
        <Link to="/" className="btn-primary">
          Go to the shop
          <Arrow className="w-[17px] h-[17px]" />
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-section-sm lg:py-24">
        <div className="bg-white border-[1.5px] border-ink rounded-md overflow-hidden shadow-label">
          <div className="bg-brand-700 text-white px-7 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 grid place-items-center mx-auto mb-3">
              <Check className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-semibold">Order placed</h1>
            <p className="font-mono text-[11px] tracking-[.12em] opacity-80 mt-1.5">{orderNo}</p>
          </div>

          <div className="p-7">
            {paidOk && (
              <p className="mb-5 flex items-center gap-2 rounded-sm border border-brand/25 bg-brand-wash px-4 py-3 text-[13px] font-semibold text-brand-800">
                <Check className="h-4 w-4 shrink-0" />
                Payment confirmed
              </p>
            )}

            <p className="text-[15px] text-ink-soft leading-relaxed mb-6">
              {hasPom
                ? 'A pharmacist is reviewing your prescription now. You will get a message confirming the final price before your card is charged, usually within 30 minutes.'
                : 'We have your order and it is being picked. You will get a message when the rider is on the way.'}
            </p>

            <dl className="border border-line rounded-md overflow-hidden">
              {[
                ['Delivering to', form.name || 'You'],
                ['Address', form.method === 'pickup' ? '13 Baale Animashaun Rd, Alakuko, Lagos' : `${form.address}, ${form.area}`],
                ['Payment', payMethods.find((m) => m.id === form.pay)?.label],
                ['Order total', formatNaira(subtotal)],
              ].map(([k, v], idx) => (
                <div
                  key={k}
                  className={`flex justify-between gap-4 px-4 py-3 text-sm ${idx > 0 ? 'border-t border-line' : ''}`}
                >
                  <dt className="font-mono text-[11.5px] tracking-[.1em] uppercase text-ink-soft pt-0.5">
                    {k}
                  </dt>
                  <dd className="font-semibold text-right">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex gap-3 mt-6 flex-wrap">
              <Link to="/" className="btn-primary flex-1 justify-center">
                Keep shopping
              </Link>
              <Link to="/" className="btn-ghost flex-1 justify-center">
                Back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const canProceed =
    step === 0
      ? form.name && form.phone && (form.method === 'pickup' || (form.address && form.area))
      : true

  const placeOrder = async () => {
    setSaveError('')

    /* Without Supabase configured, the flow still completes so the
       storefront is usable during development, but nothing is charged. */
    if (!supabase) {
      setPaidOk(false)
      setDone(true)
      clear()
      window.scrollTo({ top: 0 })
      return
    }

    setSaving(true)
    let orderNo
    try {
      const { data: noRow } = await supabase.rpc('next_order_no')
      orderNo = noRow || orderNoFallback

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_no: orderNo,
          user_id: user?.id ?? null,
          email: form.email,
          full_name: form.name,
          phone: form.phone,
          method: form.method,
          address: form.method === 'pickup' ? null : form.address,
          area: form.method === 'pickup' ? 'Alakuko' : form.area,
          note: form.note || null,
          payment: form.pay,
          subtotal,
          has_pom: hasPom,
        })
        .select('id, order_no')
        .single()

      if (error) throw error

      const lines = items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        name: i.name,
        brand: i.brand,
        image: i.image,
        price: i.price,
        qty: i.qty,
        pom: i.pom,
      }))
      const { error: itemErr } = await supabase.from('order_items').insert(lines)
      if (itemErr) throw itemErr

      setPlacedNo(order.order_no)

      /* Fire-and-forget — the admin notification must never block or fail
         the checkout itself. If email isn't configured yet, the function
         just skips quietly (see notify-admin-order/index.ts). */
      supabase.functions
        .invoke('notify-admin-order', { body: { orderNo: order.order_no } })
        .catch(() => {})
    } catch (e) {
      setSaving(false)
      setSaveError(e.message || 'We could not save your order. Please try again or call us.')
      return
    }

    /* Order exists in the database as unpaid at this point. Pickup with no
       online payment, or Paystack genuinely not configured, finish here —
       the order is real, just not marked paid. */
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
    console.log(
      '[checkout] Paystack key present:',
      Boolean(paystackKey),
      paystackKey ? paystackKey.slice(0, 12) + '…' : '(none)'
    )
    if (!paystackKey) {
      /* Do NOT mark the order complete here — that would show a screen
         indistinguishable from a real paid confirmation. Keep the customer
         on the checkout page with a visible error instead. */
      setSaving(false)
      setSaveError(
        `Payment could not be started (order ${orderNo} was saved, but is unpaid). ` +
          'Please call or WhatsApp us on +234 813 811 2519 to arrange payment — do not assume this order is confirmed.'
      )
      return
    }

    /* Paystack's script loads from an external URL and can still be loading
       when someone clicks Place order, especially on a slower connection.
       Wait briefly for it rather than assuming it's missing and silently
       skipping payment. */
    const paystackReady = await waitForPaystack(4000)
    console.log('[checkout] Paystack script loaded:', paystackReady)
    if (!paystackReady) {
      setSaving(false)
      setSaveError(
        'The payment window could not load. Check your connection and try again — your order is saved, nothing has been charged yet.'
      )
      return
    }

    if (!subtotal || subtotal <= 0) {
      setSaving(false)
      setSaveError('Your order total is ₦0 — nothing to charge. Refresh and try again.')
      return
    }

    /* PaystackPop.setup / openIframe can throw synchronously — a malformed
       key, a popup blocker, a bad parameter. Uncaught, that leaves the
       button stuck on "Placing order..." with nothing visible happening,
       which is exactly what looks like "the popup isn't working." Wrap it
       so a real error always surfaces. */
    try {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: form.email,
        amount: Math.round(subtotal * 100), // Paystack expects kobo
        ref: orderNo + '-' + Date.now(),
        currency: 'NGN',
        channels:
          form.pay === 'card' ? ['card'] : form.pay === 'transfer' ? ['bank_transfer'] : ['ussd'],
        callback: (response) => {
          // Runs after Paystack reports success client-side. This alone is
          // never trusted for something involving money — verifyPayment()
          // re-checks the transaction on the server before marking it paid.
          verifyPayment(response.reference, orderNo)
        },
        onClose: () => {
          setSaving(false)
          setPaidOk(false)
          setSaveError(
            'Payment was not completed. Your order is saved as unpaid — you can try again, or we can arrange payment another way. Order ' +
              orderNo +
              '.'
          )
        },
      })
      handler.openIframe()
    } catch (e) {
      console.error('Paystack setup failed:', e)
      setSaving(false)
      setPaidOk(false)
      setSaveError(
        'The payment window could not open (' +
          (e.message || 'unknown error') +
          '). Your order ' +
          orderNo +
          ' is saved as unpaid — please call or WhatsApp +234 813 811 2519.'
      )
    }
  }

  const verifyPayment = async (reference, orderNo) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-paystack', {
        body: { reference, orderNo },
      })
      if (error || data?.error) {
        throw new Error(data?.error || error.message)
      }
      setSaving(false)
      setPaidOk(true)
      setDone(true)
      clear()
      window.scrollTo({ top: 0 })
    } catch (e) {
      /* Payment could not be confirmed server-side. Do not show the normal
         success screen — this needs the customer's attention, not a
         checkmark that looks identical to a completed order. */
      setSaving(false)
      setPaidOk(false)
      setSaveError(
        'We could not confirm your payment automatically. Order ' +
          orderNo +
          ' is saved as unpaid — please call or WhatsApp +234 813 811 2519 before assuming it went through. ' +
          (e.message || '')
      )
    }
  }

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <h1 className="font-display text-display-md font-semibold tracking-[-.024em]">
            Checkout
          </h1>
          <ol className="flex items-center gap-3 mt-5 flex-wrap">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <button
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`flex items-center gap-2.5 text-sm font-semibold transition-colors ${
                    i === step ? 'text-brand-700' : i < step ? 'text-ink hover:text-brand-700' : 'text-ink-mute'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full grid place-items-center font-mono text-[11px] border-[1.5px] ${
                      i < step
                        ? 'bg-brand-700 text-white border-brand-700'
                        : i === step
                          ? 'border-brand-700 text-brand-700'
                          : 'border-line'
                    }`}
                  >
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  {s}
                </button>
                {i < steps.length - 1 && <span className="w-8 h-px bg-line" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div className="bg-white border border-line rounded-md p-6 lg:p-8">
            {/* ---- step 1: delivery ---- */}
            {step === 0 && (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-[-.02em] mb-5">
                  Where is it going?
                </h2>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {[
                    ['delivery', 'Deliver to me', Truck, 'Same day in Lagos'],
                    ['pickup', 'Collect in store', Pin, 'Ready in 2 hours'],
                  ].map(([id, label, Icon, note]) => (
                    <button
                      key={id}
                      onClick={() => set('method', id)}
                      className={`border-[1.5px] rounded-md p-4 text-left transition-colors ${
                        form.method === id ? 'border-brand-700 bg-brand-wash' : 'border-line hover:border-ink-soft'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-brand-700 mb-2" />
                      <b className="block text-sm font-semibold">{label}</b>
                      <span className="text-[12px] text-ink-soft">{note}</span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Full name"
                      className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      type="tel"
                      placeholder="Phone number"
                      className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                  </div>
                  <input
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    type="email"
                    placeholder="Email address"
                    className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                  />

                  {form.method === 'delivery' ? (
                    <>
                      <input
                        value={form.address}
                        onChange={(e) => set('address', e.target.value)}
                        placeholder="Street address"
                        className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                      />
                      <select
                        value={form.area}
                        onChange={(e) => set('area', e.target.value)}
                        className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                      >
                        <option value="">Choose your area</option>
                        {[
                          'Agege',
                          'Ajeromi-Ifelodun',
                          'Alimosho',
                          'Amuwo-Odofin',
                          'Apapa',
                          'Badagry',
                          'Epe',
                          'Eti-Osa (Lekki/VI)',
                          'Ibeju-Lekki',
                          'Ifako-Ijaiye',
                          'Ikeja',
                          'Ikorodu',
                          'Kosofe',
                          'Lagos Island',
                          'Lagos Mainland',
                          'Mushin',
                          'Ojo',
                          'Oshodi-Isolo',
                          'Shomolu',
                          'Surulere',
                          'Outside Lagos',
                        ].map(
                          (a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          )
                        )}
                      </select>
                    </>
                  ) : (
                    <div className="flex items-start gap-3 rounded-sm border-[1.5px] border-line bg-paper px-4 py-3.5">
                      <Pin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                      <div className="text-sm">
                        <b className="block font-semibold">Collect from our store</b>
                        <a
                          href="https://www.google.com/maps/place/Supavice+pharmacy+%26+stores/@6.6816787,3.2720243,17z/data=!4m8!3m7!1s0x103b97285a548eef:0x595158c21e2a5c5a!8m2!3d6.6816787!4d3.2720243!9m1!1b1!16s%2Fg%2F11yz8mbjcq?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-soft hover:text-brand-700 hover:underline"
                        >
                          13 Baale Animashaun Rd, Alakuko, Lagos 101233
                        </a>
                      </div>
                    </div>
                  )}

                  <textarea
                    value={form.note}
                    onChange={(e) => set('note', e.target.value)}
                    rows="3"
                    placeholder="Landmark or delivery note (optional)"
                    className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700 resize-y"
                  />
                </div>

                {hasPom && (
                  <div className="border-[1.5px] border-dashed border-line rounded-md p-5 mt-5">
                    <div className="flex items-start gap-3">
                      <Doc className="w-5 h-5 text-rx shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <b className="block text-sm font-semibold mb-1">
                          Your cart has prescription items
                        </b>
                        <p className="text-[13px] text-ink-soft leading-relaxed mb-3">
                          Upload the script now and a pharmacist reviews it while your order is
                          picked. Nothing is charged until they confirm.
                        </p>
                        <label className="btn-ghost text-sm py-2.5 px-4 cursor-pointer inline-flex">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => set('script', e.target.files[0])}
                            className="sr-only"
                          />
                          {form.script ? form.script.name : 'Choose a file'}
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ---- step 2: payment ---- */}
            {step === 1 && (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-[-.02em] mb-5">
                  How would you like to pay?
                </h2>
                <div className="grid gap-3">
                  {payMethods
                    .map((m) => (
                      <button
                        key={m.id}
                        onClick={() => set('pay', m.id)}
                        className={`border-[1.5px] rounded-md px-5 py-4 text-left flex items-center gap-4 transition-colors ${
                          form.pay === m.id ? 'border-brand-700 bg-brand-wash' : 'border-line hover:border-ink-soft'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-[1.5px] shrink-0 grid place-items-center ${
                            form.pay === m.id ? 'border-brand-700' : 'border-line'
                          }`}
                        >
                          {form.pay === m.id && <span className="w-2 h-2 rounded-full bg-brand-700" />}
                        </span>
                        <span className="flex-1">
                          <b className="block text-[15px] font-semibold">{m.label}</b>
                          <span className="text-[12.5px] text-ink-soft">{m.note}</span>
                        </span>
                      </button>
                    ))}
                </div>

                <p className="mt-5 flex items-center gap-2 border-t border-line pt-5 text-[12.5px] text-ink-soft">
                  <Lock className="h-3.5 w-3.5" />
                  You'll enter your card, transfer or USSD details on Paystack's secure payment
                  screen after you place the order — nothing is collected here.
                </p>
              </>
            )}

            {/* ---- step 3: review ---- */}
            {step === 2 && (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-[-.02em] mb-5">
                  Check it over
                </h2>

                <div className="border border-line rounded-md overflow-hidden mb-5">
                  {items.map((i, idx) => (
                    <div
                      key={i.id}
                      className={`flex gap-3 items-center px-4 py-3 ${idx > 0 ? 'border-t border-line' : ''}`}
                    >
                      <img
                        src={i.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-sm border border-line bg-white object-contain p-1"
                        onError={(e) => (e.currentTarget.style.opacity = 0)}
                      />
                      <div className="flex-1 min-w-0">
                        <b className="block text-[13.5px] font-semibold truncate">{i.name}</b>
                        <span className="font-mono text-[11px] text-ink-soft">
                          {i.qty} × {formatNaira(i.price)}
                          {i.pom && <span className="text-rx ml-2">℞</span>}
                        </span>
                      </div>
                      <span className="font-semibold text-sm shrink-0">
                        {formatNaira(i.price * i.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <dl className="grid gap-2.5 text-sm border border-line rounded-md p-4">
                  {[
                    ['Name', form.name],
                    ['Phone', form.phone],
                    [
                      form.method === 'pickup' ? 'Collect from' : 'Deliver to',
                      form.method === 'pickup' ? '13 Baale Animashaun Rd, Alakuko, Lagos' : `${form.address}, ${form.area}`,
                    ],
                    ['Payment', payMethods.find((m) => m.id === form.pay)?.label],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{k}</dt>
                      <dd className="font-medium text-right">{v || '—'}</dd>
                    </div>
                  ))}
                </dl>

                {hasPom && (
                  <p className="text-[13px] text-rx bg-rx/5 border border-rx/20 rounded-sm px-4 py-3 mt-4">
                    A pharmacist will review your prescription before dispensing. Your card is not
                    charged until they confirm the order.
                  </p>
                )}
              </>
            )}

            {saveError && (
              <p className="mt-5 rounded-sm border border-rx/25 bg-rx-wash px-4 py-3 text-[13px] text-rx-700">
                {saveError}
              </p>
            )}

            <div className="mt-7 flex gap-3 border-t border-line pt-6">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="btn-ghost">
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  onClick={() => canProceed && setStep(step + 1)}
                  disabled={!canProceed}
                  className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:shadow-none"
                >
                  Continue
                  <Arrow className="w-[17px] h-[17px]" />
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={saving}
                  className="btn-primary flex-1 justify-center"
                >
                  <Lock className="h-[17px] w-[17px]" />
                  {saving ? 'Placing order…' : `Place order · ${formatNaira(subtotal)}`}
                </button>
              )}
            </div>
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-[150px] border border-line rounded-md bg-white p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Order summary</h2>
            <dl className="grid gap-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)
                </dt>
                <dd className="font-medium">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="text-[13px] font-medium text-ink-soft">
                  {form.method === 'pickup' ? (
                    <span className="text-brand-700">Collection</span>
                  ) : (
                    'Quoted separately'
                  )}
                </dd>
              </div>
              <div className="flex justify-between pt-3 dashed-top">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-[22px] font-semibold tracking-[-.02em]">
                  {formatNaira(subtotal)}
                </dd>
              </div>
            </dl>
            {form.method !== 'pickup' && (
              <p className="mt-3 rounded-sm border border-line bg-paper px-3 py-2.5 text-[12px] leading-relaxed text-ink-soft">
                Delivery cost is confirmed with you after the order is placed and is not included in
                this total.
              </p>
            )}
            <Link
              to="/cart"
              className="block text-center text-[13px] text-brand-700 font-semibold mt-4 hover:underline"
            >
              Edit cart
            </Link>
          </aside>

          <div className="lg:hidden">
            <GoogleReviews compact />
          </div>
        </div>

        <div className="hidden lg:block lg:max-w-[520px]">
          <GoogleReviews compact />
        </div>
      </div>
    </>
  )
}
