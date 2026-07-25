import { useState } from 'react'
import { PageHead } from '../components/Bits'
import { Check, Arrow, Pin, Bag, Chat, Doc, Truck } from '../components/Icons'

const desks = [
  {
    icon: Bag,
    title: 'Orders & delivery',
    body: 'Placing an order, changing one, or asking where the rider is.',
    tel: '0801 234 5600',
    mail: 'orders@supavice.ng',
    hours: 'Daily 07:30 – 21:00',
  },
  {
    icon: Chat,
    title: 'Clinical questions',
    body: 'Dosage, interactions, side effects, whether something is safe for you.',
    tel: '0801 234 5610',
    mail: 'pharmacist@supavice.ng',
    hours: 'Daily 08:00 – 22:00',
  },
  {
    icon: Doc,
    title: 'Complaints & adverse reactions',
    body: 'Something went wrong, or a medicine caused a reaction. Goes straight to the superintendent pharmacist.',
    tel: '0801 234 5620',
    mail: 'care@supavice.ng',
    hours: 'Answered within 24 hours',
  },
  {
    icon: Truck,
    title: 'Business & wholesale',
    body: 'Corporate accounts, HMO billing, bulk supply and partnerships.',
    tel: '0801 234 5630',
    mail: 'business@supavice.ng',
    hours: 'Mon–Fri 09:00 – 17:00',
  },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState('order')

  return (
    <>
      <PageHead
        eyebrow="A person picks up"
        title="Talk to us"
        sub="Four desks, four numbers. Pick the one that matches your question and you skip being transferred."
      />

      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {desks.map((d) => (
            <article key={d.title} className="bg-white border border-line rounded-md p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-wash text-brand-700">
                  <d.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-[19px] font-semibold tracking-[-.01em] mb-1.5">
                    {d.title}
                  </h2>
                  <p className="text-[13.5px] text-ink-soft leading-[1.55] mb-4">{d.body}</p>
                  <div className="grid gap-1.5">
                    <a
                      href={`tel:+234${d.tel.replace(/\D/g, '').slice(1)}`}
                      className="font-mono text-sm text-brand-700 font-medium hover:underline"
                    >
                      {d.tel}
                    </a>
                    <a
                      href={`mailto:${d.mail}`}
                      className="text-[13px] text-ink-soft hover:text-brand-700 transition-colors break-all"
                    >
                      {d.mail}
                    </a>
                  </div>
                  <div className="dashed-top mt-4 pt-3 font-mono text-[11.5px] tracking-[.08em] uppercase text-ink-soft">
                    {d.hours}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-start">
          <div className="bg-white border border-line rounded-md p-7 lg:p-9">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-full bg-brand-700 text-white grid place-items-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="font-display text-2xl font-semibold mb-2">Message sent</h2>
                <p className="text-sm text-ink-soft max-w-[38ch] mx-auto">
                  We reply within one working day, usually much faster. If it is urgent and clinical,
                  call the pharmacist line instead.
                </p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-6">
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="eyebrow">Or write instead</div>
                <h2 className="font-display text-[28px] font-semibold tracking-[-.02em] mt-3 mb-6">
                  Send us a message
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="grid gap-4"
                >
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      required
                      placeholder="Full name"
                      className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                  />
                  <div>
                    <span className="block font-mono text-[11.5px] tracking-[.12em] uppercase text-ink-soft mb-2">
                      What is it about
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        ['order', 'An order'],
                        ['clinical', 'A clinical question'],
                        ['complaint', 'A complaint'],
                        ['business', 'Business'],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTopic(id)}
                          className={`px-4 py-2 rounded-full text-[13px] font-medium border-[1.5px] transition-colors ${
                            topic === id
                              ? 'bg-ink text-paper border-ink'
                              : 'bg-paper border-line hover:border-brand-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {topic === 'order' && (
                    <input
                      placeholder="Order number, if you have one"
                      className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                  )}
                  <textarea
                    required
                    rows="5"
                    placeholder="Tell us what is going on"
                    className="bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700 resize-y"
                  />
                  <button type="submit" className="btn-primary justify-center">
                    Send message
                    <Arrow className="w-[17px] h-[17px]" />
                  </button>
                  {topic === 'clinical' && (
                    <p className="text-[12.5px] text-rx bg-rx/5 border border-rx/20 rounded-sm px-4 py-3">
                      If this is urgent — chest pain, difficulty breathing, a severe reaction — do not
                      wait for a reply. Call 0801 234 5610 or go to the nearest hospital.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          <div>
            <div className="bg-ink text-paper rounded-md p-7">
              <div className="eyebrow eyebrow-accent">Head office</div>
              <h3 className="font-display text-2xl font-semibold tracking-[-.02em] mt-3 mb-4">
                45 Saka Tinubu Street
              </h3>
              <p className="text-[#B3C4D4] text-sm leading-[1.6] mb-5">
                Off Adeola Odeku, Victoria Island, Lagos. Reception is on the ground floor, open
                weekdays 09:00 to 17:00. The pharmacy counter downstairs never closes.
              </p>
              <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[.09em] uppercase text-accent">
                <Pin className="w-4 h-4" />
                Open in maps <Arrow className="ml-1.5 inline h-3.5 w-3.5 align-[-2px]" />
              </div>
            </div>

            <div className="border border-line rounded-md p-7 bg-white mt-4">
              <h3 className="font-display text-lg font-semibold mb-3">
                Reporting a side effect
              </h3>
              <p className="text-[13.5px] text-ink-soft leading-[1.6] mb-4">
                Tell us, and also report it to NAFDAC directly through their pharmacovigilance form.
                Both matter — ours triggers a batch check, theirs feeds the national safety record.
              </p>
              <span className="font-mono text-[11px] tracking-[.09em] uppercase text-brand-700 font-medium">
                NAFDAC ADR form <Arrow className="ml-1.5 inline h-3.5 w-3.5 align-[-2px]" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
