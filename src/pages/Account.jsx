import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, Bag, Check } from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { formatNaira } from '../data/catalog'

const STATUS_STYLE = {
  pending: 'bg-paper text-ink-soft border-line',
  confirmed: 'bg-brand-wash text-brand-800 border-brand/30',
  dispatched: 'bg-brand-wash text-brand-800 border-brand/30',
  delivered: 'bg-brand-wash text-brand-800 border-brand/40',
  cancelled: 'bg-rx-wash text-rx-700 border-rx/25',
}

export default function Account() {
  const { user, profile, signOut, updateProfile, isAdmin } = useAuth()
  const [orders, setOrders] = useState(null)
  const [tab, setTab] = useState('orders')
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', area: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        area: profile.area || '',
      })
    }
  }, [profile])

  useEffect(() => {
    let alive = true
    if (!supabase || !user) return
    supabase
      .from('orders')
      .select('id, order_no, created_at, status, subtotal, method, paid, order_items(id)')
      .order('created_at', { ascending: false })
      .then(({ data }) => alive && setOrders(data || []))
    return () => {
      alive = false
    }
  }, [user])

  const save = async (e) => {
    e.preventDefault()
    const { error } = await updateProfile(form)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6 px-6 py-10">
          <div>
            <div className="eyebrow">Your account</div>
            <h1 className="mt-3 font-display text-display-md">
              {profile?.full_name || user?.email?.split('@')[0] || 'Welcome'}
            </h1>
            <p className="mt-2 font-mono text-[12px] text-ink-soft">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <Link to="/admin" className="btn-ghost">
                Admin dashboard
              </Link>
            )}
            <button onClick={signOut} className="btn-ghost">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="mb-8 flex gap-1 border-b border-line">
          {[
            ['orders', 'Orders'],
            ['details', 'Your details'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative px-4 py-3 text-[14px] font-semibold transition-colors ${
                tab === id ? 'text-brand-700' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {label}
              {tab === id && (
                <span className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-brand" />
              )}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <>
            {orders === null && (
              <div className="grid gap-2">
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-20 animate-shimmer rounded-md bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]"
                  />
                ))}
              </div>
            )}

            {orders?.length === 0 && (
              <div className="rounded-md border border-dashed border-line py-20 text-center">
                <Bag className="mx-auto mb-4 h-8 w-8 text-ink-mute" />
                <h2 className="font-display text-xl font-semibold">No orders yet</h2>
                <p className="mx-auto mt-2 max-w-[38ch] text-sm text-ink-soft">
                  When you place an order it appears here with its status and contents.
                </p>
                <Link to="/shop" className="btn-primary mt-6">
                  Start shopping
                  <Arrow className="h-[17px] w-[17px]" />
                </Link>
              </div>
            )}

            {orders?.length > 0 && (
              <div className="overflow-hidden rounded-md border border-line">
                {orders.map((o, idx) => (
                  <div
                    key={o.id}
                    className={`flex flex-wrap items-center gap-4 bg-white px-5 py-4 ${
                      idx > 0 ? 'border-t border-line' : ''
                    }`}
                  >
                    <div className="min-w-[130px]">
                      <b className="block font-mono text-[13px]">{o.order_no}</b>
                      <span className="font-mono text-[11px] text-ink-mute">
                        {new Date(o.created_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[.08em] ${
                        STATUS_STYLE[o.status] || STATUS_STYLE.pending
                      }`}
                    >
                      {o.status}
                    </span>

                    <span className="text-[13px] text-ink-soft">
                      {o.order_items?.length || 0} item
                      {(o.order_items?.length || 0) === 1 ? '' : 's'} ·{' '}
                      {o.method === 'pickup' ? 'Collection' : 'Delivery'}
                    </span>

                    <span className="ml-auto font-display text-[17px] font-semibold tracking-[-.02em]">
                      {formatNaira(o.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'details' && (
          <form onSubmit={save} className="max-w-[520px]">
            <div className="grid gap-3">
              <label className="grid gap-1.5">
                <span className="font-mono text-[11.5px] uppercase tracking-[.12em] text-ink-soft">
                  Full name
                </span>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-mono text-[11.5px] uppercase tracking-[.12em] text-ink-soft">
                  Phone
                </span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-mono text-[11.5px] uppercase tracking-[.12em] text-ink-soft">
                  Delivery address
                </span>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-mono text-[11.5px] uppercase tracking-[.12em] text-ink-soft">
                  Area
                </span>
                <input
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="Lekki, Ikeja, Surulere…"
                  className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
                />
              </label>
            </div>

            <button type="submit" className="btn-primary mt-5">
              {saved ? (
                <>
                  <Check className="h-[17px] w-[17px]" /> Saved
                </>
              ) : (
                'Save details'
              )}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
