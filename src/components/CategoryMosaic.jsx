/**
 * Full category grid — every category shown evenly, no single tile singled
 * out as "featured." Purely visual: with no filterable catalogue page,
 * these show what the store carries rather than link anywhere.
 */
export default function CategoryMosaic({ eyebrow, title, sub, categories = [] }) {
  if (!categories.length) return null

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
      <div className="mb-8 max-w-[46ch]">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-3 font-display text-display-md">{title}</h2>
        {sub && <p className="mt-3 text-[15px] text-ink-soft">{sub}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c) => (
          <div
            key={c.slug}
            className="flex flex-col overflow-hidden rounded-md border border-line bg-white"
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-paper">
              {c.image && (
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain p-3.5"
                  onError={(e) => (e.currentTarget.style.opacity = 0)}
                />
              )}
            </div>
            <div className="flex flex-1 items-center border-t border-line px-3.5 py-3">
              <b className="text-[13.5px] font-semibold leading-tight tracking-[-.01em]">
                {c.name}
              </b>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
