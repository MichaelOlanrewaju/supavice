import { useEffect, useState } from 'react'
import { PageHead } from '../components/Bits'
import ProductCard from '../components/ProductCard'
import { fetchBestValue } from '../data/catalog'

export default function BestValue() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    fetchBestValue(72).then(setItems)
  }, [])

  return (
    <>
      <PageHead
        eyebrow="Under budget"
        title="Best value picks"
        sub="The lowest price we stock in each category — genuine product, nothing cut."
      />
      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        {items === null ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-shimmer rounded-md bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
