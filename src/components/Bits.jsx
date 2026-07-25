import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow } from './Icons'

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
    <div>
      {items.map((f, i) => (
        <div key={f.q} className="faq-item">
          <button
            className="faq-q"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
          >
            {f.q}
            <span className={`faq-sign ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          {open === i && (
            <p className="pb-5 text-[14.5px] text-ink-soft max-w-[64ch]">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}
