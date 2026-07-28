import { Link } from 'react-router-dom'
import PromoSlider from '../components/PromoSlider'
import ProductCarousel from '../components/ProductCarousel'
import ProductSpotlight from '../components/ProductSpotlight'
import CategoryMosaic from '../components/CategoryMosaic'
import ProductCard from '../components/ProductCard'
import { SectionHead, Faq } from '../components/Bits'
import { Truck, Check, Lock, Chat, Arrow } from '../components/Icons'
import {
  categories,
  products,
  brands,
  byTag,
  byCategory,
  bestValue,
  faqs,
  formatNaira,
  productImage,
} from '../data/catalog'

const perks = [
  { icon: Truck, title: 'Same-day in Lagos', body: 'Order before 16:00 for same-day dispatch.' },
  { icon: Check, title: 'Genuine or refunded', body: 'Direct from manufacturers, NAFDAC registered.' },
  { icon: Lock, title: 'Pay how you like', body: 'Card, transfer, USSD or cash on delivery.' },
  { icon: Chat, title: 'Free pharmacist advice', body: 'Ask before you buy, seven days a week.' },
]

/* one branded, in-stock, real-photo product from a category */
const pickFrom = (slug, n = 1, minPrice = 0) => {
  const pool = products.filter(
    (p) =>
      p.category === slug &&
      p.stock &&
      p.price >= minPrice &&
      !p.image.toLowerCase().includes('placeholder')
  )
  return n === 1 ? pool[0] : pool.slice(0, n)
}

export default function Home() {
  const popular = byTag('popular', 14)
  const fresh = byTag('new', 12)
  const value = bestValue(14)
  const inStock = products.filter((p) => p.stock).length

  /* spotlight: a device, since they photograph well and carry the highest value */
  const devicePool = products
    .filter(
      (p) =>
        p.category === 'diagnostics' &&
        p.stock &&
        !p.image.toLowerCase().includes('placeholder')
    )
    .sort((a, b) => b.price - a.price)
  const heroDevice = devicePool[0]
  const devicePicks = devicePool.slice(1, 5)

  /* second spotlight: supplements. Prefer a recognised wellness brand over the
     most expensive line, which skews to sports nutrition. */
  const suppPool = products
    .filter(
      (p) =>
        p.category === 'supplements' &&
        p.stock &&
        p.price > 15000 &&
        p.brand !== 'Supavice' &&
        !/anabolic|muscle|testosterone|bodybuild/i.test(p.name) &&
        !p.image.toLowerCase().includes('placeholder')
    )
    .sort((a, b) => b.price - a.price)
  const heroSupp = suppPool[0]
  const suppPicks = suppPool.slice(1, 5)

  /* mosaic: biggest category as the feature, next six as tiles */
  // all categories now shown together in one uniform grid, no featured tile

  const babyPicks = byCategory('mother-baby', 6)

  return (
    <>
      <PromoSlider />

      {/* ---------- perks ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 pb-2 pt-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
          {perks.map((k) => (
            <div key={k.title} className="flex items-start gap-3 bg-white px-5 py-4">
              <k.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-700" />
              <div>
                <b className="block text-[13px] font-bold leading-tight tracking-[-.01em]">
                  {k.title}
                </b>
                <span className="mt-1 block text-[12px] leading-snug text-ink-soft">{k.body}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- category mosaic ---------- */}
      <CategoryMosaic
        eyebrow="Shop by category"
        title="Shop by category"
        sub="From everyday paracetamol to blood pressure monitors."
        categories={categories}
      />

      {/* ---------- popular carousel ---------- */}
      <div className="border-y border-line bg-white">
        <ProductCarousel
          eyebrow="Moving fast"
          title="Popular this month"
          sub="What Lagos reaches for most across every aisle."
          items={popular}
        />
      </div>

      {/* ---------- spotlight: home diagnostics ---------- */}
      <ProductSpotlight
        eyebrow="Home diagnostics"
        title="Know your numbers"
        sub="Clinically validated monitors from Omron, with free cuff-fitting in store."
        hero={heroDevice}
        picks={devicePicks}
        tone="light"
      />

      {/* ---------- best value (desktop/tablet only — trimmed from mobile) ---------- */}
      <div className="hidden sm:block">
        <ProductCarousel
          eyebrow="Under budget"
          title="Best value picks"
          sub="The lowest price we stock in each category — genuine product, nothing cut."
          items={value}
          linkTo="/best-value"
          linkLabel="See all best value"
        />
      </div>

      {/* ---------- editorial split: mother & baby ---------- */}
      <section className="border-y border-line bg-white py-section-sm">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <div className="eyebrow">Mother &amp; baby</div>
              <h2 className="mt-3 font-display text-display-md">
                Everything for the
                <br />
                first five years
              </h2>
              <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-ink-soft">
                Infant formula, teething gel, saline drops, children's syrups and nappies. Every
                paediatric line is stocked in the strength and pack size the label specifies, so you
                are not guessing at the counter.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">
                  Ask about mother &amp; baby stock
                  <Arrow className="h-[17px] w-[17px]" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {babyPicks.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- spotlight: supplements, dark ---------- */}
      <ProductSpotlight
        eyebrow="Daily health"
        title="Supplements worth the shelf space"
        sub="Garden of Life, Vitabiotics and Revive Active — the ranges people come back for."
        hero={heroSupp}
        picks={suppPicks}
        tone="dark"
      />

      {/* ---------- new arrivals ---------- */}
      <ProductCarousel
        eyebrow="Just landed"
        title="New arrivals"
        sub="Recently added across supplements, skincare and diagnostics."
        items={fresh}
        linkTo="/new-arrivals"
        linkLabel="See what's new"
      />

      {/* ---------- brands ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <SectionHead
          eyebrow="Brands we stock"
          title="Names you know"
          sub="From Nigerian manufacturers to imported specialist ranges."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.slice(0, 12).map((b) => (
            <div
              key={b.name}
              className="grid place-items-center rounded-md border border-line bg-white px-4 py-6 text-center"
            >
              <b className="block truncate font-display text-[15px] font-semibold tracking-[-.015em]">
                {b.name}
              </b>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- trust band ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 pb-section-sm">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="border-b border-line p-8 lg:border-b-0 lg:border-r lg:p-12">
              <div className="eyebrow">Why people trust us</div>
              <h2 className="mt-4 font-display text-display-md">
                Every pack traceable
                <br />
                to its source.
              </h2>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
                We buy only from manufacturers and their appointed distributors, never the open
                market. Every product carries a NAFDAC registration number and a batch code you can
                check against the pack when it arrives.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">
                  How we source
                  <Arrow className="h-[17px] w-[17px]" />
                </Link>
                <Link to="/contact" className="btn-ghost">
                  Report a concern
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2">
              {[
                [
                  'NAFDAC registered',
                  'Every line on the shelf carries a valid registration number.',
                ],
                [
                  'Batch traceable',
                  'Scan the code on your pack to confirm batch, source and expiry.',
                ],
                [
                  'Cold chain kept',
                  'Insulin and vaccines ship insulated with a temperature log.',
                ],
                [
                  'Pharmacist checked',
                  'A registered pharmacist reviews anything that needs a script.',
                ],
              ].map(([t, d], idx) => (
                <div
                  key={t}
                  className={`p-7 ${idx % 2 === 0 ? 'sm:border-r' : ''} ${idx < 2 ? 'border-b' : ''} border-line`}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-wash text-brand-700">
                    <Check className="h-[18px] w-[18px]" />
                  </span>
                  <b className="mt-3.5 block font-display text-[17px] font-semibold tracking-[-.015em]">
                    {t}
                  </b>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 pb-section">
        <div className="grid items-start gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="eyebrow">Before you order</div>
            <h2 className="my-4 font-display text-display-md">
              Questions we get
              <br />
              every day
            </h2>
            <p className="max-w-[38ch] text-[15px] text-ink-soft">
              Still stuck? Call{' '}
              <a href="tel:+2347033137748" className="font-semibold text-brand-700 hover:underline">
                +234 703 313 7748
              </a>{' '}
              and a person picks up.
            </p>
          </div>
          <Faq items={faqs} />
        </div>
      </section>
    </>
  )
}
