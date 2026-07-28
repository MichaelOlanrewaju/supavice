import { useState } from 'react'
import { PageHead } from '../components/Bits'
import { Check, Arrow, Pin, Chat } from '../components/Icons'

const STORE_ADDRESS = '13 Baale Animashaun Rd, Alakuko, Lagos 101233'
const MAPS_URL =
  'https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYppSVrPWVAxUAAAAAHQAAAAAQEA..i&pvq=Cg0vZy8xMXl6OG1iamNxIhcKEXN1cGF2aWNlIHBoYXJtYWN5EAIYAw&lqi=ChFzdXBhdmljZSBwaGFybWFjeUj2gtWJ-b2AgAhaIxAAEAEYABgBIhFzdXBhdmljZSBwaGFybWFjeSoGCAIQABABkgEIcGhhcm1hY3k&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=ng&sa=X&ftid=0x103b97285a548eef:0x595158c21e2a5c5a'
const PHONE_DISPLAY = '+234 813 811 2519'
const PHONE_TEL = 'tel:+2348138112519'
const WHATSAPP = 'https://wa.me/2348138112519'

const storeImages = [
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnJHanc5wxvBdqh1g9YYy-SsWHxbzpvHmyyFyPraIpsrvF1EUVcT6qsmvCbqkrsxnVobwrFLq_IJ-kJmAlmdkEKKQ_JwqApkwgcEgyY9aGQ-02XFvbj6eZ84OTvnU_moMHSCEZG3PRf8ZiV=w229-h191-n-k-no-nu',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSorU4q8BDD2NItJlElH-pG1UjB5GTGVGRBIcqBm8Aa5E9cQ5awh86dr0oNknRGNeOdQcIFgKeLYnF--UYXWcjTK3WXEVcmEMstESFi2b-R5T2PFKbaNnjuMks8vV47kXLRdXhgDwvigoW=s1360-w1360-h1020-rw',
  'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnnNOOi80j6Hvp8nItb_-k-yzRre4f_nQQpvtaE1WNbYJUDEKCAatd2qrakxiw6XXVM4xqVxzleQszYl8vAFMeJU3txOMFsrFyvx7pz6poCTZmwiv3lPk7kyCVIjFIZ6pmcyxVpPAbLeac=s1360-w1360-h1020-rw',
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState('order')

  return (
    <>
      <PageHead
        eyebrow="Get in touch"
        title="Talk to us"
        sub="Call, message on WhatsApp, or visit the store in Alakuko — whichever is easiest for you."
      />

      {/* ---------- store photos ---------- */}
      <section className="mx-auto max-w-[1280px] px-6 pt-2">
        <div className="grid gap-3 sm:grid-cols-3">
          {storeImages.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/3] overflow-hidden rounded-md border border-line bg-paper"
            >
              <img
                src={src}
                alt={`Supavice Pharmacy store, Alakuko — photo ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.opacity = 0)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-section-sm">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          {/* ---------- form ---------- */}
          <div className="rounded-md border border-line bg-white p-7 lg:p-9">
            {sent ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-700 text-white">
                  <Check className="h-7 w-7" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-semibold">Message sent</h2>
                <p className="mx-auto max-w-[38ch] text-sm text-ink-soft">
                  We reply within one working day, usually much faster. For anything urgent, call or
                  WhatsApp us directly.
                </p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-6">
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="eyebrow">Send a message</div>
                <h2 className="mb-6 mt-3 font-display text-[28px] font-semibold tracking-[-.02em]">
                  How can we help?
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="grid gap-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Full name"
                      className="rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      className="rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    className="rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-700"
                  />
                  <div>
                    <span className="mb-2 block text-[13.5px] font-semibold uppercase tracking-[.02em] text-ink-soft">
                      What is it about
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ['order', 'An order'],
                        ['clinical', 'A clinical question'],
                        ['complaint', 'A complaint'],
                        ['other', 'Something else'],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTopic(id)}
                          className={`rounded-full border-[1.5px] px-4 py-2 text-[13px] font-medium transition-colors ${
                            topic === id
                              ? 'border-ink bg-ink text-paper'
                              : 'border-line bg-paper hover:border-brand-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {topic === 'order' && (
                    <input
                      placeholder="Order number, if you have one"
                      className="rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-700"
                    />
                  )}
                  <textarea
                    required
                    rows="5"
                    placeholder="Tell us what is going on"
                    className="resize-y rounded-sm border-[1.5px] border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-700"
                  />
                  <button type="submit" className="btn-primary justify-center">
                    Send message
                    <Arrow className="h-[17px] w-[17px]" />
                  </button>
                  {topic === 'clinical' && (
                    <p className="rounded-sm border border-rx/20 bg-rx-wash px-4 py-3 text-[12.5px] text-rx">
                      If this is urgent — chest pain, difficulty breathing, a severe reaction — do not
                      wait for a reply. Call {PHONE_DISPLAY} or go to the nearest hospital.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          {/* ---------- contact details + map ---------- */}
          <div className="grid gap-4">
            <div className="rounded-md bg-ink p-7 text-paper">
              <div className="eyebrow eyebrow-accent">Our store</div>
              <h3 className="mb-4 mt-3 font-display text-2xl font-semibold tracking-[-.02em]">
                Alakuko, Lagos
              </h3>
              <p className="mb-5 text-sm leading-[1.6] text-[#B3C4D4]">{STORE_ADDRESS}</p>

              <div className="grid gap-2.5">
                <a
                  href={PHONE_TEL}
                  className="flex items-center gap-2.5 text-[15px] font-semibold text-white hover:text-brand transition-colors"
                >
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[15px] font-semibold text-white hover:text-brand transition-colors"
                >
                  <Chat className="h-4 w-4" />
                  Message us on WhatsApp
                </a>
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-2 text-[13.5px] font-medium uppercase tracking-[.02em] text-accent hover:underline"
              >
                <Pin className="h-4 w-4" />
                Open in Google Maps <Arrow className="ml-0.5 inline h-3.5 w-3.5 align-[-2px]" />
              </a>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-md border border-line">
              <iframe
                title="Supavice Pharmacy location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-md border border-line bg-white p-7">
              <h3 className="mb-3 font-display text-lg font-semibold">Reporting a side effect</h3>
              <p className="mb-4 text-[13.5px] leading-[1.6] text-ink-soft">
                Tell us directly, and also report it to NAFDAC through their pharmacovigilance
                channel. Both matter — ours triggers a batch check here, theirs feeds the national
                safety record.
              </p>
              <a
                href="https://nafdac.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] font-semibold uppercase tracking-[.02em] text-brand-700 hover:underline"
              >
                Visit NAFDAC <Arrow className="ml-1.5 inline h-3.5 w-3.5 align-[-2px]" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
