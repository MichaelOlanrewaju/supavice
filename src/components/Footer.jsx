import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <footer className="bg-brand-800 text-[#C3D5E5] pt-[60px]">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] gap-11 pb-11">
          <div>
            <img
              src="/brand/supavice-logo-white.png"
              srcSet="/brand/supavice-logo-white.png 1x, /brand/supavice-logo-white@2x.png 2x"
              alt="Supavice"
              width="253"
              height="36"
              className="h-9 w-auto"
            />
            <p className="text-sm leading-[1.6] my-4 max-w-[36ch]">
              A registered Nigerian community pharmacy chain. Superintendent Pharmacist: Pharm. T.
              Bello, PCN 27/4419.
            </p>
            <span className="font-mono text-[11px] border border-white/20 px-3 py-1.5 rounded-sm inline-block">
              PCN PREMISES 04/LA/2211
            </span>
          </div>

          <div>
            <h4 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-accent mb-4 font-medium">
              Shop
            </h4>
            <div className="grid gap-2.5">
              {[
                ['All products', '/shop'],
                ['Best value', '/shop?filter=value'],
                ['New arrivals', '/shop?filter=new'],
                ['Supplements', '/shop?cat=supplements'],
                ['Infections', '/shop?cat=infections'],
                ['Mother & baby', '/shop?cat=mother-baby'],
              ].map(([l, to]) => (
                <Link key={l} to={to} className="text-sm hover:text-white transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-accent mb-4 font-medium">
              Help
            </h4>
            <div className="grid gap-2.5">
              {[
                ['Track your order', '/contact'],
                ['Delivery & returns', '/contact'],
                ['Prescription orders', '/contact'],
                ['Find a store', '/stores'],
                ['Contact us', '/contact'],
              ].map(([l, to]) => (
                <Link key={l} to={to} className="text-sm hover:text-white transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-accent mb-4 font-medium">
              Stay stocked
            </h4>
            <p className="text-sm leading-[1.6]">
              Refill reminders and price drops on the medicine you actually buy. No daily blasts.
            </p>
            <form onSubmit={submit} className="flex gap-2 mt-3.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="flex-1 min-w-0 px-4 py-3 rounded-sm border-[1.5px] border-white/20 bg-white/5 text-white text-sm outline-none focus:border-accent placeholder:text-[#8AA5BC]"
              />
              <button
                type="submit"
                className="bg-rx-600 text-[#FFFFFF] px-5 py-3 rounded-sm font-semibold text-sm whitespace-nowrap"
              >
                {done ? 'Done' : 'Subscribe'}
              </button>
            </form>
            <p className="text-[12.5px] text-[#8AA5BC] mt-3">
              {done
                ? 'Check your inbox to confirm.'
                : 'We never share your health data. Unsubscribe any time.'}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 flex justify-between items-center gap-5 flex-wrap text-[13px]">
          <span>© 2026 Supavice Pharmacy Limited. All rights reserved.</span>
          <div className="flex gap-5 flex-wrap">
            {['Terms', 'Privacy', 'Cookies', 'Return policy'].map((l) => (
              <Link key={l} to="/contact" className="hover:text-white transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
