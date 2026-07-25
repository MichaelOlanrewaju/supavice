import { useMemo, useState } from 'react'
import { PageHead } from '../components/Bits'
import { Search, Pin } from '../components/Icons'
import { stores } from '../data/catalog'

export default function Stores() {
  const [q, setQ] = useState('')
  const [only24, setOnly24] = useState(false)

  const list = useMemo(() => {
    let out = stores
    if (only24) out = out.filter((s) => s.open24)
    if (q) {
      const t = q.toLowerCase()
      out = out.filter(
        (s) => s.name.toLowerCase().includes(t) || s.address.toLowerCase().includes(t)
      )
    }
    return out
  }, [q, only24])

  return (
    <>
      <PageHead
        eyebrow="42 branches across Lagos"
        title="There is a counter near you"
        sub="Collect an order, get your blood pressure checked, or just ask a question in person. Three branches never close."
      >
        <div className="flex gap-3 flex-wrap mt-7 max-w-xl">
          <div className="flex-1 min-w-[240px] flex items-center gap-2.5 bg-paper border-[1.5px] border-line rounded-sm px-4 focus-within:border-brand-700 transition-colors">
            <Search className="w-[18px] h-[18px] text-ink-mute shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by area or street"
              aria-label="Search stores"
              className="flex-1 bg-transparent py-3 text-sm outline-none min-w-0"
            />
          </div>
          <button
            onClick={() => setOnly24(!only24)}
            className={`px-5 py-3 rounded-sm text-sm font-semibold border-[1.5px] transition-colors ${
              only24 ? 'bg-ink text-paper border-ink' : 'bg-paper border-line hover:border-brand-700'
            }`}
          >
            Open 24 hours
          </button>
        </div>
      </PageHead>

      <section className="mx-auto max-w-[1280px] px-6 py-12">
        <p className="text-sm text-ink-soft mb-6">
          <b className="text-ink font-semibold">{list.length}</b>{' '}
          {list.length === 1 ? 'branch' : 'branches'}
          {only24 && ' open around the clock'}
        </p>

        {list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-line rounded-md">
            <Pin className="w-8 h-8 mx-auto text-ink-mute mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No branch there yet</h3>
            <p className="text-sm text-ink-soft max-w-[38ch] mx-auto">
              We deliver everywhere in Lagos even where we have no shop. Try a nearby area, or just
              order online.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((s) => (
              <article
                key={s.id}
                className="border border-line rounded-md p-[22px] bg-white flex flex-col gap-3 hover:border-brand-700 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <h2 className="font-display text-[19px] font-semibold tracking-[-.01em]">
                    {s.name}
                  </h2>
                  <span
                    className={`font-mono text-[11px] tracking-[.08em] uppercase px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                      s.open24 ? 'bg-rx-600/20 text-rx-700' : 'bg-brand-wash text-brand-700'
                    }`}
                  >
                    {s.open24 ? '24 hours' : 'Open now'}
                  </span>
                </div>
                <address className="not-italic text-[13.5px] text-ink-soft leading-[1.5]">
                  {s.address}
                </address>
                <div className="flex justify-between items-center pt-3 dashed-top mt-auto">
                  <span className="text-[12.5px] text-ink-soft">{s.hours}</span>
                  <a
                    href={`tel:+234${s.phone.replace(/\D/g, '').slice(1)}`}
                    className="font-mono text-[13px] text-brand-700 font-medium hover:underline"
                  >
                    {s.phone}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 bg-ink text-paper rounded-md p-8 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="eyebrow eyebrow-accent">Not near any of them?</div>
            <h2 className="font-display text-display-md font-semibold tracking-[-.02em] leading-[1.1] my-3">
              We deliver everywhere in Lagos anyway
            </h2>
            <p className="text-[#B3C4D4] text-[15px] max-w-[46ch]">
              Branches are for collecting, testing and asking questions in person. For everything
              else, put your address in at checkout — mainland or island, same day.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-white/10 rounded-sm overflow-hidden">
            {[
              ['90 min', 'Average delivery'],
              ['₦1,500', 'Flat Lagos rate'],
              ['9', 'Branches to collect from'],
            ].map(([n, l]) => (
              <div key={l} className="bg-ink px-5 py-6 text-center">
                <b className="font-display text-[26px] font-semibold block tracking-[-.02em]">{n}</b>
                <span className="font-mono text-[11.5px] tracking-[.1em] uppercase text-[#8FA3B5]">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
