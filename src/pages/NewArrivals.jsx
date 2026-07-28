import { PageHead } from '../components/Bits'
import ProductCard from '../components/ProductCard'
import { byTag } from '../data/catalog'

export default function NewArrivals() {
  const items = byTag('new', 60)

  return (
    <>
      <PageHead
        eyebrow="Just landed"
        title="New arrivals"
        sub="Recently added across supplements, skincare and diagnostics."
      />
      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  )
}
