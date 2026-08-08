import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/Bits'
import { fetchPosts } from '../data/blog'

export default function Blog() {
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    fetchPosts().then(setPosts)
  }, [])

  return (
    <>
      <PageHead
        eyebrow="From the pharmacy"
        title="Health notes"
        sub="Straightforward guidance on medicine, symptoms and staying well — written by the team at Supavice."
      />
      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        {posts === null ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-shimmer rounded-md bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-[15px] text-ink-soft">Nothing published yet — check back soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-md border border-line bg-white transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-card"
              >
                <div className="aspect-[4/3] overflow-hidden bg-paper">
                  {p.cover_image && (
                    <img
                      src={p.cover_image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.style.opacity = 0)}
                    />
                  )}
                </div>
                <div className="p-5">
                  {p.tags?.[0] && (
                    <span className="text-[11px] font-semibold uppercase tracking-[.06em] text-brand-700">
                      {p.tags[0]}
                    </span>
                  )}
                  <h2 className="mt-1.5 line-clamp-2 font-display text-[17px] font-semibold leading-snug tracking-[-.01em] group-hover:text-brand-700">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">
                      {p.excerpt}
                    </p>
                  )}
                  <span className="mt-3 block text-[11px] text-ink-mute">
                    {new Date(p.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
