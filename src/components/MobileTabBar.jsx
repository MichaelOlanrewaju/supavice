import { NavLink, useLocation } from 'react-router-dom'
import { Home, Doc, Cart, Users as User } from './Icons'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

/**
 * Fixed bottom navigation, mobile only. The primary way shoppers move around
 * on a phone, so targets are large and the active state is unmistakable.
 * Hidden on admin, which has its own sidebar chrome.
 */
export default function MobileTabBar() {
  const { count } = useCart()
  const { user } = useAuth()
  const { pathname } = useLocation()

  if (pathname.startsWith('/admin')) return null

  const tabs = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/track-order', label: 'Track', icon: Doc },
    { to: '/cart', label: 'Cart', icon: Cart, badge: count },
    { to: user ? '/account' : '/login', label: user ? 'Account' : 'Sign in', icon: User },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, badge, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to)
          return (
            <NavLink
              key={label}
              to={to}
              className={`relative flex flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors ${
                active ? 'text-brand-700' : 'text-ink-mute'
              }`}
            >
              <span className="relative">
                <Icon className="h-[23px] w-[23px]" />
                {badge > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rx px-1 text-[10px] font-bold text-white">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              {label}
              {active && (
                <span className="absolute inset-x-6 top-0 h-[2.5px] rounded-full bg-brand" />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
