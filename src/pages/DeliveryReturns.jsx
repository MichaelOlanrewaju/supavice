import { Link } from 'react-router-dom'
import { PageHead, Faq } from '../components/Bits'
import { Truck, Pin, Check, Arrow } from '../components/Icons'

const faqs = [
  {
    q: 'How is my delivery cost worked out?',
    a: 'We confirm it with you by phone or WhatsApp after your order is placed, based on distance and size. Nothing is charged at checkout — your order total there is the product cost only.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Order before 16:00 and it usually leaves the same day, most arriving within a few hours across Lagos. Outside Lagos, expect 2–4 working days depending on the courier route.',
  },
  {
    q: 'Can I collect instead?',
    a: 'Yes — choose collection at checkout and pick it up from our Alakuko store. We hold collection orders for 72 hours.',
  },
  {
    q: 'What can I return?',
    a: 'Devices, supplements and personal care items can be returned unopened within 7 days of delivery. Medicine cannot be returned once it leaves our custody — a Pharmacy Council of Nigeria safety rule, not a policy choice.',
  },
  {
    q: 'What if the wrong item arrives, or something is damaged?',
    a: 'Tell us within 48 hours of delivery and we replace it free of charge — no return needed for our own error.',
  },
  {
    q: 'How do refunds work?',
    a: 'Approved refunds go back to the original payment method through Paystack, usually within 5–10 working days depending on your bank.',
  },
]

export default function DeliveryReturns() {
  return (
    <>
      <PageHead
        eyebrow="Policy"
        title="Delivery & returns"
        sub="What to expect once you place an order, and what happens if something needs to come back."
      />

      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-line bg-white p-6">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-wash text-brand-700">
              <Truck className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-[19px] font-semibold tracking-[-.01em]">
              Delivery
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Same-day across Lagos for orders placed before 16:00. Cost is confirmed by phone or
              WhatsApp after you order — never charged automatically at checkout.
            </p>
          </div>

          <div className="rounded-md border border-line bg-white p-6">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-wash text-brand-700">
              <Pin className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-[19px] font-semibold tracking-[-.01em]">
              Collection
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Choose collection at checkout and pick up from our store at 13 Baale Animashaun Rd,
              Alakuko. We hold your order for 72 hours.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Returns, in short</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <p className="text-[14px] leading-relaxed text-ink-soft">
                <b className="text-ink">Devices, supplements, personal care</b> — returnable
                unopened within 7 days.
              </p>
            </div>
            <div className="flex gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <p className="text-[14px] leading-relaxed text-ink-soft">
                <b className="text-ink">Wrong or damaged item</b> — tell us within 48 hours, we
                replace it free.
              </p>
            </div>
            <div className="flex gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-rx" />
              <p className="text-[14px] leading-relaxed text-ink-soft">
                <b className="text-ink">Medicine</b> — cannot be returned once dispensed. This is a
                PCN safety requirement, not our choice.
              </p>
            </div>
            <div className="flex gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <p className="text-[14px] leading-relaxed text-ink-soft">
                <b className="text-ink">Refunds</b> — back to your original payment method via
                Paystack, typically 5–10 working days.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="eyebrow">Common questions</div>
            <h2 className="my-4 font-display text-display-md">
              Delivery &amp; returns,
              <br />
              in detail
            </h2>
            <p className="max-w-[38ch] text-[15px] text-ink-soft">
              Still unsure?{' '}
              <Link to="/contact" className="font-semibold text-brand-700 hover:underline">
                Message us
              </Link>{' '}
              and we'll sort it out directly.
            </p>
          </div>
          <Faq items={faqs} />
        </div>

        <div className="mt-14 rounded-md bg-ink p-8 text-white sm:p-10">
          <div className="eyebrow eyebrow-accent">Track what you ordered</div>
          <h2 className="mt-3 font-display text-display-sm text-white">
            Already placed an order?
          </h2>
          <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-[#A8BDD0]">
            Check its status any time with your email and order number.
          </p>
          <Link to="/track-order" className="btn-primary mt-6">
            Track your order
            <Arrow className="h-[17px] w-[17px]" />
          </Link>
        </div>
      </section>
    </>
  )
}
