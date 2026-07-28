import { PageHead } from '../components/Bits'
import ProductCard from '../components/ProductCard'
import { bestValue } from '../data/catalog'

export default function BestValue() {
  const items = bestValue(72)

  return (
    <>
      <PageHead
        eyebrow="Under budget"
        title="Best value picks"
        sub="The lowest price we stock in each category — genuine product, nothing cut."
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
