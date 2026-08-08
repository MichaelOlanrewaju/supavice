import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Bag, Menu, Close } from './Icons'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatNaira } from '../data/catalog'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/best-value', label: 'Best value' },
  { to: '/new-arrivals', label: 'New arrivals' },
  { to: '/blog', label: 'Blog' },
  { to: '/prescription-orders', label: 'Prescriptions' },
  { to: '/delivery-returns', label: 'Delivery & returns' },
  { to: '/contact', label: 'Help' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count, total } = useCart()
  const { user, profile, isAdmin } = useAuth()

  return (
    <>
      <div className="bg-brand-800 text-[#D9E8F5] text-[13px]">
        <div className="mx-auto max-w-[1280px] px-6 min-h-[40px] flex items-center justify-between gap-4 flex-wrap">
          <p>
            Same-day delivery across Lagos — <b className="font-semibold text-white">order before 16:00</b>
          </p>
          <div className="hidden sm:flex gap-5">
            <Link to="/track-order" className="hover:text-white hover:underline">
              Track order
            </Link>
            <Link to="/contact" className="hover:text-white hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-line bg-paper">
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

            <div className="flex items-center gap-1 ml-auto">
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
                  end={n.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden border-t border-line bg-white">
            <div className="mx-auto max-w-[1280px] px-6 py-4">
              <div className="grid gap-px bg-line">
                {[
                  ...nav,
                  { to: '/cart', label: 'Cart' },
                  { to: user ? '/account' : '/login', label: user ? 'My account' : 'Sign in' },
                ].map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.to === '/'}
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
