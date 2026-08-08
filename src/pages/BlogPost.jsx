import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import ProductCard from '../components/ProductCard'
import { Arrow } from '../components/Icons'
import { fetchPost } from '../data/blog'
import { fetchProducts } from '../data/catalog'

const mdComponents = {
  h2: (p) => (
    <h2 className="mt-8 mb-3 font-display text-[22px] font-semibold tracking-[-.015em]" {...p} />
  ),
  h3: (p) => (
    <h3 className="mt-6 mb-2 font-display text-[18px] font-semibold tracking-[-.01em]" {...p} />
  ),
  p: (p) => <p className="mb-4 text-[15.5px] leading-[1.75] text-ink-soft" {...p} />,
  ul: (p) => <ul className="mb-4 ml-5 list-disc space-y-1.5 text-[15.5px] text-ink-soft" {...p} />,
  ol: (p) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-[15.5px] text-ink-soft" {...p} />,
  li: (p) => <li className="leading-relaxed" {...p} />,
  a: (p) => <a className="font-semibold text-brand-700 hover:underline" {...p} />,
  strong: (p) => <strong className="font-semibold text-ink" {...p} />,
  blockquote: (p) => (
    <blockquote className="my-5 border-l-[3px] border-brand pl-4 italic text-ink-soft" {...p} />
  ),
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(undefined) // undefined = loading, null = not found
  const [related, setRelated] = useState([])

  useEffect(() => {
    let live = true
    setPost(undefined)
    setRelated([])
    fetchPost(slug).then(async (p) => {
      if (!live) return
      setPost(p)
      if (p?.related_products?.length) {
        const all = await fetchProducts()
        if (live) setRelated(all.filter((x) => p.related_products.includes(x.id)))
      }
    })
    return () => {
      live = false
    }
  }, [slug])

  if (post === undefined) {
    return (
      <div className="mx-auto max-w-[760px] px-6 py-section">
        <div className="h-6 w-40 animate-shimmer rounded-sm bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-section text-center">
        <h1 className="font-display text-display-sm">Article not found</h1>
        <p className="mt-3 text-[15px] text-ink-soft">
          It may have been unpublished or the link is wrong.
        </p>
        <Link to="/blog" className="btn-primary mt-6">
          Back to Health notes
          <Arrow className="h-[17px] w-[17px]" />
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-[760px] px-6 py-section-sm">
      {post.tags?.[0] && (
        <span className="text-[12px] font-semibold uppercase tracking-[.06em] text-brand-700">
          {post.tags[0]}
        </span>
      )}
      <h1 className="mt-3 font-display text-display-lg">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-[13px] text-ink-mute">
        <span>{post.author}</span>
        <span>·</span>
        <span>
          {new Date(post.created_at).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {post.cover_image && (
        <img
          src={post.cover_image}
          alt=""
          className="mt-6 aspect-[16/9] w-full rounded-md object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}

      <div className="mt-8">
        <ReactMarkdown components={mdComponents}>{post.content}</ReactMarkdown>
      </div>

      {related.length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <h2 className="mb-4 font-display text-[19px] font-semibold">Mentioned in this article</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-line pt-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-700 hover:underline">
          <Arrow className="h-4 w-4 rotate-180" />
          Back to Health notes
        </Link>
      </div>
    </article>
  )
}
