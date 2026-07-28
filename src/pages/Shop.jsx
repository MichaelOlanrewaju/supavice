import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { Search, Close, Filter, ChevLeft, ChevRight } from '../components/Icons'
import { categories, products, categoryOf, brands as allBrandList } from '../data/catalog'

const PER_PAGE = 24

const sorts = [
  { id: 'featured', label: 'Featured' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'brand', label: 'Brand' },
]

const priceBands = [
  { id: 'all', label: 'Any price', min: 0, max: Infinity },
  { id: 'u5k', label: 'Under ₦5,000', min: 0, max: 5000 },
  { id: '5k15k', label: '₦5,000 – ₦15,000', min: 5000, max: 15000 },
  { id: '15k40k', label: '₦15,000 – ₦40,000', min: 15000, max: 40000 },
  { id: 'o40k', label: 'Over ₦40,000', min: 40000, max: Infinity },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'all'
  const filter = params.get('filter') || ''
  const q = params.get('q') || ''
  const brand = params.get('brand') || ''
  const sort = params.get('sort') || 'featured'
  const page = Math.max(1, parseInt(params.get('page') || '1', 10))

  const [band, setBand] = useState('all')
  const [pomOnly, setPomOnly] = useState(false)
  const [inStock, setInStock] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const setParam = (key, val, resetPage = true) => {
    const next = new URLSearchParams(params)
    if (!val || val === 'all') next.delete(key)
    else next.set(key, val)
    if (resetPage) next.delete('page')
    setParams(next)
  }

  const list = useMemo(() => {
    let out = [...products]
    if (cat !== 'all') out = out.filter((x) => x.category === cat)
    if (brand) out = out.filter((x) => x.brand === brand)
    if (filter) out = out.filter((x) => x.tags.includes(filter))
    if (pomOnly) out = out.filter((x) => x.pom)
    if (inStock) out = out.filter((x) => x.stock)

    const b = priceBands.find((x) => x.id === band)
    if (b && b.id !== 'all') out = out.filter((x) => x.price >= b.min && x.price < b.max)

    if (q) {
      const t = q.toLowerCase()
      out = out.filter(
        (x) =>
          x.name.toLowerCase().includes(t) ||
          x.brand.toLowerCase().includes(t) ||
          (x.rawCategory || '').toLowerCase().includes(t) ||
          (x.pack || '').toLowerCase().includes(t)
      )
    }

    if (sort === 'low') out.sort((a, b2) => a.price - b2.price)
    if (sort === 'high') out.sort((a, b2) => b2.price - a.price)
    if (sort === 'name') out.sort((a, b2) => a.name.localeCompare(b2.name))
    if (sort === 'brand') out.sort((a, b2) => a.brand.localeCompare(b2.brand))
    return out
  }, [cat, filter, q, brand, sort, band, pomOnly, inStock])

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const safePage = Math.min(page, pages)
  const shown = list.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [safePage])

  const activeCat = categoryOf(cat)
  const allBrands = allBrandList.slice(0, 40)
  const hasFilters = q || cat !== 'all' || filter || brand || band !== 'all' || pomOnly || inStock

  const clearAll = () => {
    setParams(new URLSearchParams())
    setBand('all')
    setPomOnly(false)
    setInStock(false)
  }

  const title = activeCat
    ? activeCat.name
    : q
      ? `Results for "${q}"`
      : brand
        ? brand
        : filter === 'flash'
          ? 'Flash sale'
          : filter === 'deal'
            ? 'This week\u2019s deals'
            : filter === 'new'
              ? 'New arrivals'
              : 'Everything on the shelves'

  const sidebar = (
    <>
      <div className="mb-6">
        <h3 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-ink-soft mb-3">
          Category
        </h3>
        <div className="grid gap-px bg-line border border-line rounded-md overflow-hidden max-h-[340px] overflow-y-auto">
          <button
            onClick={() => setParam('cat', 'all')}
            className={`bg-white text-left px-4 py-2.5 text-sm hover:text-brand-700 transition-colors ${
              cat === 'all' ? 'font-semibold text-brand-700' : ''
            }`}
          >
            All products
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setParam('cat', c.slug)}
              className={`bg-white text-left px-4 py-2.5 text-sm flex justify-between items-center gap-2 hover:text-brand-700 transition-colors ${
                cat === c.slug ? 'font-semibold text-brand-700' : ''
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                {c.image && (
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="h-6 w-6 shrink-0 rounded-sm bg-paper object-contain"
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  />
                )}
                <span className="truncate">{c.name}</span>
              </span>
              <span className="font-mono text-[11.5px] text-ink-mute shrink-0">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-ink-soft mb-3">
          Price
        </h3>
        <div className="grid gap-1.5">
          {priceBands.map((b) => (
            <label key={b.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={band === b.id}
                onChange={() => setBand(b.id)}
                className="w-3.5 h-3.5 accent-[#00668C]"
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-ink-soft mb-3">
          Brand
        </h3>
        <div className="grid gap-px bg-line border border-line rounded-md overflow-hidden max-h-[220px] overflow-y-auto">
          <button
            onClick={() => setParam('brand', '')}
            className={`bg-white text-left px-4 py-2 text-[13px] hover:text-brand-700 transition-colors ${
              !brand ? 'font-semibold text-brand-700' : ''
            }`}
          >
            All brands
          </button>
          {allBrands.map((b) => (
            <button
              key={b.name}
              onClick={() => setParam('brand', b.name)}
              className={`bg-white text-left px-4 py-2 text-[13px] flex justify-between gap-2 hover:text-brand-700 transition-colors ${
                brand === b.name ? 'font-semibold text-brand-700' : ''
              }`}
            >
              <span className="truncate">{b.name}</span>
              <span className="font-mono text-[11.5px] text-ink-mute shrink-0">{b.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-ink-soft mb-3">
          Refine
        </h3>
        <label className="flex items-center gap-2.5 text-sm py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 accent-[#00668C]"
          />
          In stock only
        </label>
        <label className="flex items-center gap-2.5 text-sm py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={pomOnly}
            onChange={(e) => setPomOnly(e.target.checked)}
            className="w-4 h-4 accent-[#00668C]"
          />
          Prescription only (℞)
        </label>
        <label className="flex items-center gap-2.5 text-sm py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filter === 'deal'}
            onChange={(e) => setParam('filter', e.target.checked ? 'deal' : '')}
            className="w-4 h-4 accent-[#00668C]"
          />
          On offer
        </label>
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="btn-ghost w-full justify-center text-sm py-3">
          Clear all filters
        </button>
      )}
    </>
  )

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="font-mono text-[11px] tracking-[.08em] uppercase text-ink-soft flex gap-2 mb-3">
            <Link to="/" className="hover:text-brand-700">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink">{activeCat ? activeCat.name : 'Shop'}</span>
          </div>
          <h1 className="font-display text-display-lg">
            {title}
          </h1>
          <p className="text-[15px] text-ink-soft mt-2">
            {list.length} {list.length === 1 ? 'product' : 'products'} · same-day delivery in Lagos
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="grid lg:grid-cols-[236px_1fr] gap-8">
          <aside className="hidden lg:block lg:sticky lg:top-[150px] lg:self-start lg:max-h-[calc(100vh-170px)] lg:overflow-y-auto no-scrollbar">
            {sidebar}
          </aside>

          <div>
            <div className="flex justify-between items-center gap-4 flex-wrap mb-6 pb-5 border-b border-line">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 border-[1.5px] border-line rounded-sm px-4 py-2.5 text-sm font-semibold"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <p className="text-sm text-ink-soft hidden lg:block">
                Showing{' '}
                <b className="text-ink font-semibold">
                  {shown.length ? (safePage - 1) * PER_PAGE + 1 : 0}–
                  {(safePage - 1) * PER_PAGE + shown.length}
                </b>{' '}
                of {list.length}
              </p>

              <div className="flex items-center gap-3 ml-auto">
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="text-[13px] text-ink-soft hover:text-rx flex items-center gap-1.5 transition-colors"
                  >
                    <Close className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
                <label className="flex items-center gap-2 text-[13px]">
                  <span className="text-ink-soft hidden sm:inline">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setParam('sort', e.target.value)}
                    className="bg-white border border-line rounded-sm px-3 py-2 text-[13px] outline-none focus:border-brand-700 cursor-pointer"
                  >
                    {sorts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>


            {shown.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-line rounded-md">
                <Search className="w-8 h-8 mx-auto text-ink-mute mb-4" />
                <h2 className="font-display text-xl font-semibold mb-2">Nothing matched that</h2>
                <p className="text-sm text-ink-soft max-w-[38ch] mx-auto mb-5">
                  Try a different spelling or widen the filters. If we should stock it, tell us and
                  we will look into it.
                </p>
                <button onClick={clearAll} className="btn-ghost">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {shown.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>

                {pages > 1 && (
                  <nav
                    className="flex justify-center items-center gap-2 mt-10"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setParam('page', String(safePage - 1), false)}
                      disabled={safePage === 1}
                      aria-label="Previous page"
                      className="w-10 h-10 rounded-sm grid place-items-center border border-line bg-white hover:border-brand-700 disabled:opacity-35 disabled:hover:border-line transition-colors"
                    >
                      <ChevLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: pages }, (_, n) => n + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setParam('page', String(n), false)}
                        aria-current={n === safePage ? 'page' : undefined}
                        className={`w-10 h-10 rounded-sm font-mono text-[13px] border transition-colors ${
                          n === safePage
                            ? 'bg-brand-700 text-white border-brand-700'
                            : 'bg-white border-line hover:border-brand-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => setParam('page', String(safePage + 1), false)}
                      disabled={safePage === pages}
                      aria-label="Next page"
                      className="w-10 h-10 rounded-sm grid place-items-center border border-line bg-white hover:border-brand-700 disabled:opacity-35 disabled:hover:border-line transition-colors"
                    >
                      <ChevRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-ink/50"
            aria-label="Close filters"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-md border border-line"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{sidebar}</div>
            <div className="flex gap-3 border-t border-line p-4">
              {hasFilters && (
                <button onClick={clearAll} className="btn-ghost flex-1 py-3">
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-sm bg-brand-700 py-3 text-[15px] font-bold text-white"
              >
                Show {list.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
