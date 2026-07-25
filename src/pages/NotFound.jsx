import { Link } from 'react-router-dom'
import { Arrow } from '../components/Icons'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 lg:py-32 text-center">
      <div className="font-mono text-[11px] tracking-[.14em] uppercase text-brand-700 mb-5">
        Error 404
      </div>
      <h1 className="font-display text-display-xl font-semibold tracking-[-.03em] leading-[1] mb-5">
        That shelf is empty
      </h1>
      <p className="text-[17px] text-ink-soft max-w-[46ch] mx-auto mb-8">
        The page you asked for does not exist, or it moved. The shop is still where you left it.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/" className="btn-primary">
          Back to the front
          <Arrow className="w-[17px] h-[17px]" />
        </Link>
        <Link to="/shop" className="btn-ghost">
          Browse products
        </Link>
      </div>
    </section>
  )
}
