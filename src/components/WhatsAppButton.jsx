import { useLocation } from 'react-router-dom'

/**
 * Floating WhatsApp button — fixed bottom-right on every page. Uses the
 * real WhatsApp glyph rather than a generic chat bubble, since that's what
 * people scan for.
 *
 * Sits above the mobile tab bar on small screens so it never overlaps it.
 */
export default function WhatsAppButton() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null

  const number = '2348138112519'
  const message = encodeURIComponent("Hi, I'd like to ask about a product.")

  /* Product pages have their own sticky "Buy now" bar just above the mobile
     tab bar — clear both, not just the tab bar, so the two never overlap. */
  const hasStickyBuyBar = pathname.startsWith('/product/')
  const mobileBottom = hasStickyBuyBar
    ? 'bottom-[calc(9.5rem+env(safe-area-inset-bottom))]'
    : 'bottom-[calc(4.75rem+env(safe-area-inset-bottom))]'

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-lift transition-transform duration-200 ease-smooth hover:scale-105 active:scale-95 ${mobileBottom} lg:bottom-6`}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="white" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.652 4.527 1.786 6.393L4 29l7.8-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.98 16.4c-.298.836-1.47 1.53-2.42 1.73-.645.136-1.487.244-4.32-.927-3.626-1.5-5.96-5.19-6.14-5.43-.18-.24-1.472-1.96-1.472-3.738 0-1.778.933-2.652 1.264-3.014.33-.362.72-.452.96-.452.24 0 .48.002.69.013.222.01.518-.084.81.618.298.72 1.014 2.494 1.104 2.676.09.18.15.394.03.634-.12.24-.18.39-.36.6-.18.21-.378.469-.54.63-.18.18-.368.376-.158.736.21.36.936 1.545 2.01 2.503 1.383 1.234 2.548 1.617 2.91 1.797.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.208 1.71Z" />
      </svg>
    </a>
  )
}
