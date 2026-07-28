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
            <span className="inline-block rounded-md bg-white px-4 py-2.5 shadow-xs">
              <img
                src="/brand/supavice-logo.png"
                srcSet="/brand/supavice-logo.png 1x, /brand/supavice-logo@2x.png 2x"
                alt="Supavice"
                width="253"
                height="36"
                className="h-8 w-auto"
              />
            </span>
            <p className="text-sm leading-[1.6] my-4 max-w-[36ch]">
              Your neighbourhood pharmacy in Alakuko, Lagos — genuine medicine, real advice, and
              same-day delivery across the city.
            </p>
            <div className="grid gap-1.5 text-sm">
              <a
                href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYppSVrPWVAxUAAAAAHQAAAAAQEA..i&pvq=Cg0vZy8xMXl6OG1iamNxIhcKEXN1cGF2aWNlIHBoYXJtYWN5EAIYAw&lqi=ChFzdXBhdmljZSBwaGFybWFjeUj2gtWJ-b2AgAhaIxAAEAEYABgBIhFzdXBhdmljZSBwaGFybWFjeSoGCAIQABABkgEIcGhhcm1hY3k&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=ng&sa=X&ftid=0x103b97285a548eef:0x595158c21e2a5c5a"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                13 Baale Animashaun Rd, Alakuko, Lagos 101233
              </a>
              <a href="tel:+2347033137748" className="hover:text-white hover:underline">
                +234 703 313 7748
              </a>
              <a
                href="https://wa.me/2347033137748"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11.5px] tracking-[.13em] uppercase text-accent mb-4 font-medium">
              Company
            </h4>
            <div className="grid gap-2.5">
              {[
                ['Home', '/'],
                ['Best value', '/best-value'],
                ['New arrivals', '/new-arrivals'],
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
              Support
            </h4>
            <div className="grid gap-2.5">
              {[
                ['Track your order', '/track-order'],
                ['Delivery & returns', '/delivery-returns'],
                ['Prescription orders', '/prescription-orders'],
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
            {[
              ['Terms', '/contact'],
              ['Privacy', '/contact'],
              ['Return policy', '/delivery-returns'],
            ].map(([l, to]) => (
              <Link key={l} to={to} className="hover:text-white transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
