import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, Plus } from './Icons'

export function SectionHead({ eyebrow, title, sub, linkTo, linkLabel }) {
  return (
    <div className="flex justify-between items-end gap-6 mb-7 flex-wrap">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="font-display mt-3 text-display-md">
          {title}
        </h2>
        {sub && <p className="text-[15px] text-ink-soft mt-2 max-w-[52ch]">{sub}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-sm font-semibold text-brand-700 flex items-center gap-2 pb-1.5 border-b-[1.5px] border-transparent hover:border-brand-700 transition-colors whitespace-nowrap"
        >
          {linkLabel} <Arrow className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

export function PageHead({ eyebrow, title, sub, children }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:py-section-sm">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="font-display mt-4 text-display-lg max-w-[18ch]">
          {title}
        </h1>
        {sub && <p className="text-[17px] text-ink-soft mt-4 max-w-[58ch]">{sub}</p>}
        {children}
      </div>
    </section>
  )
}

export function Faq({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="grid gap-3">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div
            key={f.q}
            className={`overflow-hidden rounded-md border bg-white transition-colors duration-200 ${
              isOpen ? 'border-brand-700' : 'border-line'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <span
                className={`text-[15px] font-semibold leading-snug tracking-[-.005em] transition-colors ${
                  isOpen ? 'text-brand-700' : 'text-ink'
                }`}
              >
                {f.q}
              </span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? 'rotate-45 border-brand-700 bg-brand-700 text-white'
                    : 'border-line bg-paper text-ink-soft'
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-smooth"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="max-w-[64ch] px-5 pb-5 text-[14.5px] leading-relaxed text-ink-soft sm:px-6">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
