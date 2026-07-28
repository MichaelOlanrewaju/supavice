import { Link } from 'react-router-dom'
import { PageHead, Faq } from '../components/Bits'
import { Doc, Check, Arrow, Chat } from '../components/Icons'

const steps = [
  {
    n: '1',
    title: 'Add it to your cart',
    body: 'Prescription-only medicine is marked ℞ on the product card. Add it like anything else — nothing is blocked at this stage.',
  },
  {
    n: '2',
    title: 'Upload your prescription',
    body: "At checkout you'll be asked for a photo or scan of a valid prescription from a licensed doctor.",
  },
  {
    n: '3',
    title: 'A pharmacist reviews it',
    body: 'Our registered pharmacist checks the prescription against your order before anything is dispensed.',
  },
  {
    n: '4',
    title: 'We dispatch or call you',
    body: "If everything checks out, it ships with the rest of your order. If we need to clarify something, we'll call you first.",
  },
]

const faqs = [
  {
    q: 'What counts as a valid prescription?',
    a: 'A clear photo or scan showing the patient name, the medicine and dosage, the prescribing doctor\u2019s name, and a date within the last 6 months. A photo of the medicine box alone is not enough.',
  },
  {
    q: 'Can I upload it after I order?',
    a: 'Yes — if you check out without it, we hold the ℞ items and message you for the prescription before dispatch. Non-prescription items in the same order still go out on schedule.',
  },
  {
    q: 'What if I do not have a prescription yet?',
    a: 'We cannot dispense prescription-only medicine without one — this is a Pharmacy Council of Nigeria requirement, not something we can waive. See a doctor first, then come back to us.',
  },
  {
    q: 'Is my prescription kept private?',
    a: 'Yes. It is visible only to the dispensing pharmacist reviewing your order, stored securely, and never shared.',
  },
  {
    q: 'Can I ask a pharmacist a question before ordering?',
    a: 'Yes — message us and a registered pharmacist will get back to you, free of charge.',
  },
]

export default function PrescriptionOrders() {
  return (
    <>
      <PageHead
        eyebrow="℞ Prescription-only medicine"
        title="How prescription orders work"
        sub="Ordering a prescription-only medicine takes one extra step. Here is exactly what happens."
      />

      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-md border border-line bg-white p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-rx-wash font-display text-[15px] font-semibold text-rx-700">
                {s.n}
              </span>
              <h2 className="mt-4 text-[15px] font-semibold leading-tight tracking-[-.01em]">
                {s.title}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-md border border-rx/20 bg-rx-wash p-6 sm:p-7">
          <Doc className="mt-0.5 h-6 w-6 shrink-0 text-rx-700" />
          <div>
            <h2 className="font-display text-lg font-semibold text-rx-700">
              Why we ask for this
            </h2>
            <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-ink-soft">
              Prescription-only medicine can be harmful if taken without medical supervision — wrong
              dosage, drug interactions, or a condition that needs a different treatment entirely. A
              pharmacist checking your prescription is a safeguard for you, and a legal requirement
              we follow without exception.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="eyebrow">Common questions</div>
            <h2 className="my-4 font-display text-display-md">
              Prescriptions,
              <br />
              answered
            </h2>
            <p className="max-w-[38ch] text-[15px] text-ink-soft">
              Still unsure?{' '}
              <Link to="/contact" className="font-semibold text-brand-700 hover:underline">
                Message us
              </Link>{' '}
              and a pharmacist will help directly.
            </p>
          </div>
          <Faq items={faqs} />
        </div>

        <div className="mt-14 rounded-md bg-ink p-8 text-white sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="eyebrow eyebrow-accent">Ask before you order</div>
              <h2 className="mt-3 font-display text-display-sm text-white">
                Not sure if you need a script?
              </h2>
              <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-[#A8BDD0]">
                Message our pharmacist and we'll tell you plainly, before you buy anything.
              </p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0">
              <Chat className="h-[17px] w-[17px]" />
              Ask a pharmacist
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
