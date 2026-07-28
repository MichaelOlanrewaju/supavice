import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Search, Heart, Bag, Menu, Close } from './Icons'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatNaira } from '../data/catalog'

const nav = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?filter=value', label: 'Best value' },
  { to: '/shop?filter=new', label: 'New arrivals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Help' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const { count, total, saved } = useCart()
  const { user, profile, isAdmin } = useAuth()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
    setOpen(false)
  }

  return (
    <>
      <div className="bg-brand-800 text-[#D9E8F5] text-[13px]">
        <div className="mx-auto max-w-[1280px] px-6 min-h-[40px] flex items-center justify-between gap-4 flex-wrap">
          <p>
            Same-day delivery across Lagos — <b className="font-semibold text-white">order before 16:00</b>
          </p>
          <div className="hidden sm:flex gap-5">
            <Link to="/shop" className="hover:text-white hover:underline">
              Find a store
            </Link>
            <Link to="/contact" className="hover:text-white hover:underline">
              Track order
            </Link>
            <Link to="/contact" className="hover:text-white hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-paper border-b border-line">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center gap-4 lg:gap-7 py-4">
            <Link to="/" className="shrink-0" aria-label="Supavice Pharmacy — home">
              <img
                src="/brand/supavice-logo.png"
                srcSet="/brand/supavice-logo.png 1x, /brand/supavice-logo@2x.png 2x"
                alt="Supavice"
                width="253"
                height="36"
                className="h-8 sm:h-9 w-auto"
              />
            </Link>

            <form
              onSubmit={submit}
              className="hidden md:flex flex-1 items-center gap-2.5 bg-white border-[1.5px] border-line rounded-full pl-[18px] pr-1.5 py-1.5 focus-within:border-brand-700 focus-within:ring-4 focus-within:ring-brand/10 transition"
            >
              <Search className="w-[18px] h-[18px] text-ink-mute shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Search medicines, brands or conditions"
                aria-label="Search products"
                className="flex-1 bg-transparent outline-none text-[14.5px] min-w-0 placeholder:text-ink-mute"
              />
              <button
                type="submit"
                className="bg-brand-700 text-white rounded-full px-5 py-2.5 text-[13.5px] font-semibold hover:bg-brand-800 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-1 ml-auto md:ml-0">
              <Link
                to="/shop"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-[13.5px] font-medium hover:bg-brand-wash transition-colors"
              >
                <Heart className="w-[19px] h-[19px]" />
                <span className="hidden lg:inline">Saved</span>
                {saved > 0 && <em className="font-mono text-xs text-rx not-italic">{saved}</em>}
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-sm text-[13.5px] font-medium hover:bg-brand-wash transition-colors"
              >
                <span className="relative">
                  <Bag className="w-[19px] h-[19px]" />
                  {count > 0 && (
                    <em className="absolute -top-1.5 -right-2 bg-rx text-white font-mono text-[9px] not-italic px-1.5 py-px rounded-full">
                      {count}
                    </em>
                  )}
                </span>
                <span className="hidden lg:inline">Cart</span>
                <em className="font-mono text-xs text-brand-700 not-italic hidden lg:inline">
                  {formatNaira(total)}
                </em>
              </Link>
              <Link
                to={user ? '/account' : '/login'}
                className="hidden rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-brand-800 sm:block"
              >
                {user
                  ? (profile?.full_name?.split(' ')[0] || 'Account') + (isAdmin ? ' · Admin' : '')
                  : 'Sign in'}
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2.5 rounded-sm hover:bg-brand-wash"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? <Close className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-line bg-white hidden lg:block">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                >
                  {n.label}
                </NavLink>
              ))}
              <span className="w-px h-5 bg-line mx-2" />
              <NavLink to="/shop?filter=value" className="nav-link !text-rx font-bold">
                Best value
              </NavLink>
            </div>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden border-t border-line bg-white">
            <div className="mx-auto max-w-[1280px] px-6 py-4">
              <form onSubmit={submit} className="flex items-center gap-2 mb-4">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="Search medicines"
                  className="flex-1 bg-paper border-[1.5px] border-line rounded-sm px-4 py-3 text-sm outline-none focus:border-brand-700"
                />
                <button className="bg-brand-700 text-white px-5 py-3 rounded-sm text-sm font-semibold">
                  Go
                </button>
              </form>
              <div className="grid gap-px bg-line">
                {[...nav, { to: '/cart', label: 'Cart' }, { to: user ? '/account' : '/login', label: user ? 'My account' : 'Sign in' }].map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `bg-white px-4 py-3.5 text-[15px] font-medium ${isActive ? 'text-brand-700' : ''}`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
