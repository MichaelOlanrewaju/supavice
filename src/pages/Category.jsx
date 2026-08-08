import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHead } from '../components/Bits'
import ProductCard from '../components/ProductCard'
import { Arrow } from '../components/Icons'
import { fetchCategories, fetchByCategory } from '../data/catalog'

export default function Category() {
  const { slug } = useParams()
  const [cat, setCat] = useState(null)
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    setLoading(true)
    setCat(null)
    setItems(null)
    Promise.all([fetchCategories(), fetchByCategory(slug)]).then(([cats, prods]) => {
      if (!live) return
      setCat(cats.find((c) => c.slug === slug) || null)
      setItems(prods)
      setLoading(false)
    })
    return () => {
      live = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="h-6 w-40 animate-shimmer rounded-sm bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]" />
      </div>
    )
  }

  if (!cat) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-section text-center">
        <h1 className="font-display text-display-sm">Category not found</h1>
        <p className="mt-3 text-[15px] text-ink-soft">
          That aisle doesn't exist. Take a look at everything we carry instead.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to home
          <Arrow className="h-[17px] w-[17px]" />
        </Link>
      </div>
    )
  }

  return (
    <>
      <PageHead eyebrow="Category" title={cat.name} />
      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        {items.length === 0 ? (
          <p className="text-[15px] text-ink-soft">Nothing in stock here right now.</p>
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
