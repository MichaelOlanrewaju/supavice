import { useParams, Link } from 'react-router-dom'
import { PageHead } from '../components/Bits'
import ProductCard from '../components/ProductCard'
import { Arrow } from '../components/Icons'
import { categories, byCategory } from '../data/catalog'

export default function Category() {
  const { slug } = useParams()
  const cat = categories.find((c) => c.slug === slug)
  const items = byCategory(slug)

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
