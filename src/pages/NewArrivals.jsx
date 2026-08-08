import { useEffect, useState } from 'react'
import { PageHead } from '../components/Bits'
import ProductCard from '../components/ProductCard'
import { fetchByTag } from '../data/catalog'

export default function NewArrivals() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    fetchByTag('new', 60).then(setItems)
  }, [])

  return (
    <>
      <PageHead
        eyebrow="Just landed"
        title="New arrivals"
        sub="Recently added across supplements, skincare and diagnostics."
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
