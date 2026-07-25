import { Link } from 'react-router-dom'
import { PageHead } from '../components/Bits'
import { Arrow } from '../components/Icons'

const timeline = [
  ['2011', 'One counter in Yaba', 'Two pharmacists, a fridge, and a landline that rang constantly.'],
  ['2015', 'Ten branches', 'The first 24-hour shop opened on Admiralty Way after a bad malaria season.'],
  ['2019', 'Cold chain', 'Insulin and vaccines started moving in temperature-logged boxes.'],
  ['2022', 'Online dispensing', 'Prescriptions could be uploaded and reviewed without coming in.'],
  ['2026', '42 branches', 'Same-day across Lagos, with pharmacists on chat seven days a week.'],
]

const values = [
  [
    'We would rather lose the sale',
    'If a pharmacist thinks you should see a doctor instead of buying what is in your cart, they will say so. That has cost us money and we have kept doing it.',
  ],
  [
    'Nothing from the open market',
    'Every pack comes from the manufacturer or their appointed distributor. Not one product on our shelves was bought from a trader.',
  ],
  [
    'Prices you can see before you commit',
    'The price on the page is the price. Prescription totals are quoted in full before anything is dispensed.',
  ],
  [
    'A person picks up the phone',
    'Not a menu tree. During opening hours a human answers, and they can see your order.',
  ],
]

export default function About() {
  return (
    <>
      <PageHead
        eyebrow="Registered · PCN 04/LA/2211"
        title="A community pharmacy that happens to have a website"
        sub="Supavice started as one counter in Yaba in 2011. The shops are still the point — the site just means you do not have to come in when you cannot."
      />

      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-14">
          <div>
            <div className="eyebrow">Fifteen years</div>
            <h2 className="font-display my-4 text-display-md">
              How we got here
            </h2>
            <p className="text-[15px] text-ink-soft leading-[1.65] max-w-[46ch]">
              We are not a startup that discovered pharmacy. We are a pharmacy that eventually built
              software, after fifteen years of learning what people actually walk in and ask for.
            </p>
          </div>

          <ol className="grid">
            {timeline.map(([year, title, body], i) => (
              <li key={year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs text-brand-700 font-medium pt-1">{year}</span>
                  {i < timeline.length - 1 && <span className="w-px flex-1 bg-line mt-2" />}
                </div>
                <div>
                  <b className="font-display text-lg font-semibold block tracking-[-.01em]">
                    {title}
                  </b>
                  <p className="text-sm text-ink-soft leading-relaxed mt-1 max-w-[48ch]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white border-y border-line py-section-sm">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="eyebrow mb-4">What we hold to</div>
          <h2 className="font-display mb-9 text-display-md max-w-[20ch]">
            Four things we will not trade away
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {values.map(([t, d], i) => (
              <article key={t} className="border border-line rounded-md p-6 bg-paper">
                <span className="font-mono text-[11px] text-brand-700 tracking-[.1em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[21px] font-semibold tracking-[-.015em] mt-2 mb-2.5">
                  {t}
                </h3>
                <p className="text-[14px] text-ink-soft leading-[1.6]">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="bg-ink text-paper rounded-md p-8 lg:p-12">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div>
              <div className="eyebrow eyebrow-accent">Regulatory</div>
              <h2 className="font-display text-display-md font-semibold tracking-[-.022em] leading-[1.1] my-4">
                Who is accountable for what leaves our shelves
              </h2>
              <p className="text-[#B3C4D4] text-[15px] leading-[1.65] max-w-[52ch]">
                Every branch operates under a named superintendent pharmacist registered with the
                Pharmacy Council of Nigeria. Premises are licensed and inspected. If something goes
                wrong, there is a specific person answerable for it, and you are entitled to know
                their name.
              </p>
              <Link to="/contact" className="btn-primary mt-7">
                Raise a concern
                <Arrow className="w-[17px] h-[17px]" />
              </Link>
            </div>
            <dl className="grid gap-px bg-white/10 rounded-sm overflow-hidden">
              {[
                ['Superintendent Pharmacist', 'Pharm. T. Bello'],
                ['PCN registration', '27/4419'],
                ['Premises licence', '04/LA/2211'],
                ['Registered', 'RC 918442'],
              ].map(([k, v]) => (
                <div key={k} className="bg-ink px-5 py-4 flex justify-between gap-4 items-center">
                  <dt className="font-mono text-[11.5px] tracking-[.1em] uppercase text-[#8FA3B5]">
                    {k}
                  </dt>
                  <dd className="font-semibold text-sm text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
