import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  Box,
  Cart,
  Users as UsersIcon,
  Cog,
  Chart,
  Plus,
  Search,
  Trash,
  Close,
  Check,
  Lock,
  Logout,
  Menu,
} from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { formatNaira } from '../data/catalog'

const NAV = [
  ['overview', 'Dashboard', Home],
  ['products', 'Products', Box],
  ['orders', 'Orders', Cart],
  ['users', 'Customers', UsersIcon],
  ['settings', 'Settings', Cog],
]

const STATUSES = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled']

const STATUS_STYLE = {
  pending: 'bg-warn-bg text-warn border-warn-border',
  confirmed: 'bg-info-bg text-info border-info-border',
  dispatched: 'bg-brand-wash text-brand-800 border-brand/30',
  delivered: 'bg-ok-bg text-ok border-ok-border',
  cancelled: 'bg-rx-wash text-rx-700 border-rx/25',
}

const emptyProduct = {
  id: '',
  name: '',
  brand: 'Supavice',
  price: 0,
  was: null,
  category: '',
  pack: '',
  image: '',
  pom: false,
  stock: true,
  active: true,
  sku: '',
}

export default function Admin() {
  const { profile, signOut } = useAuth()
  const [tab, setTab] = useState('overview')
  const [navOpen, setNavOpen] = useState(false)
  const current = NAV.find(([id]) => id === tab)

  return (
    <div className="min-h-screen bg-[#F4F7FA] lg:grid lg:grid-cols-[264px_1fr]">
      {navOpen && (
        <button
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-ink text-white transition-transform duration-300 ease-smooth lg:static lg:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <img src="/brand/supavice-logo-white.png" alt="Supavice" className="h-7 w-auto" />
          <span className="rounded bg-brand/20 px-2 py-0.5 font-mono text-[12.5px] uppercase tracking-[.14em] text-brand">
            Admin
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 font-mono text-[12.5px] uppercase tracking-[.16em] text-white/35">
            Manage
          </p>
          {NAV.map(([id, label, Icon]) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => {
                  setTab(id)
                  setNavOpen(false)
                }}
                className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[14.5px] font-medium transition-colors ${
                  active
                    ? 'bg-brand-700 text-white shadow-[inset_3px_0_0_#00CCFF]'
                    : 'text-[#A8BDD0] hover:bg-white/[.06] hover:text-white'
                }`}
              >
                <Icon className="h-[19px] w-[19px] shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            className="mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-[#A8BDD0] transition-colors hover:bg-white/[.06] hover:text-white"
          >
            <Home className="h-[18px] w-[18px]" />
            View store
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-[#A8BDD0] transition-colors hover:bg-white/[.06] hover:text-white"
          >
            <Logout className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-white px-5 py-3.5 lg:px-8">
          <button
            onClick={() => setNavOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md border border-line lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-[22px] font-semibold tracking-[-.02em]">
            {current?.[1]}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-semibold leading-tight">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="text-[12.5px] text-ink-mute">Administrator</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-[14px] font-bold text-white">
              {(profile?.full_name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-5 lg:p-8">
          {tab === 'overview' && <Overview onJump={setTab} />}
          {tab === 'products' && <Products />}
          {tab === 'orders' && <Orders />}
          {tab === 'users' && <Users me={profile} />}
          {tab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  )
}

function Overview({ onJump }) {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    if (!supabase) return
    let alive = true
    ;(async () => {
      const [prod, orders, users, recentOrders] = await Promise.all([
        supabase.from('products').select('id, stock, pom, active'),
        supabase.from('orders').select('id, subtotal, status'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('id, order_no, full_name, subtotal, status, created_at')
          .order('created_at', { ascending: false })
          .limit(6),
      ])
      if (!alive) return
      const o = orders.data || []
      setStats({
        products: prod.data?.length || 0,
        outOfStock: prod.data?.filter((p) => !p.stock).length || 0,
        orders: o.length,
        pending: o.filter((x) => x.status === 'pending').length,
        revenue: o.filter((x) => x.status !== 'cancelled').reduce((s, x) => s + x.subtotal, 0),
        users: users.count || 0,
      })
      setRecent(recentOrders.data || [])
    })()
    return () => {
      alive = false
    }
  }, [])

  if (!stats) return <Skeleton rows={2} />

  const cards = [
    ['Order value', formatNaira(stats.revenue), 'excludes cancelled', Chart, 'text-ok'],
    ['Orders', stats.orders.toLocaleString('en-NG'), `${stats.pending} awaiting action`, Cart, 'text-brand-700'],
    ['Products live', stats.products.toLocaleString('en-NG'), `${stats.outOfStock} out of stock`, Box, 'text-info'],
    ['Customers', stats.users.toLocaleString('en-NG'), 'registered accounts', UsersIcon, 'text-warn'],
  ]

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, hint, Icon, tint]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-5 shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[13px] font-medium text-ink-soft">{label}</span>
              <Icon className={`h-5 w-5 ${tint}`} />
            </div>
            <p className="mt-3 font-display text-[30px] font-semibold tracking-[-.03em]">{value}</p>
            <p className="mt-1 text-[12.5px] text-ink-mute">{hint}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[16px] font-semibold">Recent orders</h2>
          <button
            onClick={() => onJump('orders')}
            className="text-[13px] font-semibold text-brand-700 hover:underline"
          >
            View all
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-ink-soft">No orders yet.</p>
        ) : (
          <div className="divide-y divide-line">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold">{o.full_name}</p>
                  <p className="font-mono text-[13px] text-ink-mute">{o.order_no}</p>
                </div>
                <StatusPill status={o.status} />
                <span className="w-24 text-right font-display text-[16px] font-semibold">
                  {formatNaira(o.subtotal)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Products() {
  const [rows, setRows] = useState(null)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [page, setPage] = useState(0)
  const PER = 20

  const load = useCallback(async () => {
    if (!supabase) return
    let query = supabase
      .from('products')
      .select('id, name, brand, price, category, stock, pom, active, image, pack, sku')
      .order('name')
      .range(page * PER, page * PER + PER - 1)
    if (q.trim()) query = query.ilike('name', `%${q.trim()}%`)
    const { data } = await query
    setRows(data || [])
  }, [q, page])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async (p, field) => {
    await supabase.from('products').update({ [field]: !p[field] }).eq('id', p.id)
    load()
  }

  const remove = async (p) => {
    if (
      !confirm(
        `Delete "${p.name}"? This cannot be undone.\n\nTip: use Hide to remove it from the shop without losing the record.`
      )
    )
      return
    await supabase.from('products').delete().eq('id', p.id)
    load()
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-line bg-white px-4 shadow-xs focus-within:border-brand-700">
          <Search className="h-[18px] w-[18px] shrink-0 text-ink-mute" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(0)
            }}
            placeholder="Search products"
            className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none"
          />
        </div>
        <button
          onClick={() => setEditing({ ...emptyProduct })}
          className="flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-brand-800"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add product
        </button>
      </div>

      {rows === null ? (
        <Skeleton rows={6} />
      ) : rows.length === 0 ? (
        <Empty text="No products matched." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-xs">
          <div className="hidden grid-cols-[auto_1fr_120px_110px_140px] items-center gap-4 border-b border-line bg-[#F8FAFC] px-5 py-3 text-[13px] font-semibold uppercase tracking-[.06em] text-ink-mute lg:grid">
            <span className="w-11">Image</span>
            <span>Product</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-line">
            {rows.map((p) => (
              <div
                key={p.id}
                className={`grid grid-cols-[auto_1fr] items-center gap-4 px-5 py-3.5 lg:grid-cols-[auto_1fr_120px_110px_140px] ${
                  !p.active ? 'opacity-55' : ''
                }`}
              >
                <img
                  src={p.image}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-md border border-line bg-white object-contain p-1"
                  onError={(e) => (e.currentTarget.style.opacity = 0)}
                />
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold">{p.name}</p>
                  <p className="text-[12.5px] text-ink-soft">
                    {p.brand}
                    {p.pack ? ` · ${p.pack}` : ''}
                    {p.pom ? ' · ℞' : ''}
                  </p>
                  <p className="mt-1 font-display text-[15px] font-semibold lg:hidden">
                    {formatNaira(p.price)}
                  </p>
                </div>

                <span className="hidden font-display text-[15px] font-semibold lg:block">
                  {formatNaira(p.price)}
                </span>

                <button
                  onClick={() => toggle(p, 'stock')}
                  className={`hidden w-fit rounded-full border px-3 py-1 text-[13px] font-semibold transition-colors lg:block ${
                    p.stock
                      ? 'border-ok-border bg-ok-bg text-ok'
                      : 'border-line bg-paper text-ink-mute'
                  }`}
                >
                  {p.stock ? 'In stock' : 'Out of stock'}
                </button>

                <div className="col-span-2 mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 lg:col-span-1 lg:mt-0 lg:justify-end">
                  <button
                    onClick={() => toggle(p, 'stock')}
                    className={`rounded-full border px-2.5 py-1 text-[13px] font-semibold lg:hidden ${
                      p.stock
                        ? 'border-ok-border bg-ok-bg text-ok'
                        : 'border-line bg-paper text-ink-mute'
                    }`}
                  >
                    {p.stock ? 'In stock' : 'Out'}
                  </button>
                  <button
                    onClick={() => toggle(p, 'active')}
                    className="text-[13px] font-medium text-ink-soft hover:text-brand-700"
                  >
                    {p.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => setEditing(p)}
                    className="text-[13px] font-semibold text-brand-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p)}
                    aria-label="Delete"
                    className="text-ink-mute transition-colors hover:text-rx"
                  >
                    <Trash className="h-[17px] w-[17px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-[14px] font-semibold shadow-xs disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-[14px] text-ink-soft">Page {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={(rows?.length || 0) < PER}
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-[14px] font-semibold shadow-xs disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </div>
  )
}

function ProductEditor({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isNew = !product.id
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const payload = {
      ...form,
      id: form.id || form.name.toLowerCase().replace(/[^\w]+/g, '-').slice(0, 70),
      price: Number(form.price) || 0,
      was: form.was ? Number(form.was) : null,
    }
    const { error } = await supabase.from('products').upsert(payload)
    setBusy(false)
    if (error) return setError(error.message)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-ink/60 backdrop-blur-sm sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-white sm:max-w-[560px] sm:rounded-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-line bg-white px-6 py-4">
          <h2 className="text-[19px] font-semibold">{isNew ? 'Add product' : 'Edit product'}</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-rx">
            <Close className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={save} className="grid gap-4 p-6">
          <Field label="Product name" value={form.name} onChange={(v) => set('name', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand" value={form.brand} onChange={(v) => set('brand', v)} />
            <Field label="SKU" value={form.sku || ''} onChange={(v) => set('sku', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₦)" type="number" value={form.price} onChange={(v) => set('price', v)} required />
            <Field label="Was (₦, optional)" type="number" value={form.was ?? ''} onChange={(v) => set('was', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category slug" value={form.category || ''} onChange={(v) => set('category', v)} />
            <Field label="Pack size" value={form.pack || ''} onChange={(v) => set('pack', v)} />
          </div>
          <Field label="Image URL" value={form.image || ''} onChange={(v) => set('image', v)} />

          <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-line bg-paper px-4 py-3.5">
            {[
              ['stock', 'In stock'],
              ['pom', 'Prescription only'],
              ['active', 'Visible in shop'],
            ].map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2.5 text-[14px] font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(form[k])}
                  onChange={(e) => set(k, e.target.checked)}
                  className="h-[18px] w-[18px] accent-[#0077A3]"
                />
                {label}
              </label>
            ))}
          </div>

          {error && (
            <p className="rounded-lg border border-rx/25 bg-rx-wash px-4 py-3 text-[14px] text-rx-700">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-lg bg-brand-700 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-6 py-3 text-[15px] font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Orders() {
  const [rows, setRows] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = useCallback(async () => {
    if (!supabase) return
    let q = supabase
      .from('orders')
      .select('*, order_items(id, name, qty, price)')
      .order('created_at', { ascending: false })
      .limit(100)
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setRows(data || [])
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (o, status) => {
    await supabase.from('orders').update({ status }).eq('id', o.id)
    load()
  }

  const setFee = async (o) => {
    const v = prompt(`Delivery fee for ${o.order_no} (₦). Leave blank to clear.`, o.delivery_fee ?? '')
    if (v === null) return
    await supabase
      .from('orders')
      .update({ delivery_fee: v.trim() === '' ? null : Number(v) })
      .eq('id', o.id)
    load()
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg border px-4 py-2 text-[14px] font-semibold capitalize transition-colors ${
              filter === s
                ? 'border-ink bg-ink text-white'
                : 'border-line bg-white hover:border-brand-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {rows === null ? (
        <Skeleton rows={4} />
      ) : rows.length === 0 ? (
        <Empty text="No orders yet." />
      ) : (
        <div className="grid gap-4">
          {rows.map((o) => (
            <div key={o.id} className="rounded-xl border border-line bg-white p-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <b className="font-mono text-[14px]">{o.order_no}</b>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="mt-2 text-[15px] font-semibold">{o.full_name}</p>
                  <p className="text-[14px] text-ink-soft">
                    {o.phone} · {o.email}
                  </p>
                  <p className="mt-0.5 text-[14px] text-ink-soft">
                    {o.method === 'pickup' ? `Collect · ${o.area}` : `${o.address}, ${o.area}`}
                  </p>
                  <p className="mt-1 text-[12.5px] text-ink-mute">
                    {new Date(o.created_at).toLocaleString('en-NG')}
                  </p>
                  {o.has_pom && (
                    <span className="mt-2 inline-block rounded-md border border-rx/25 bg-rx-wash px-2.5 py-1 text-[13px] font-semibold text-rx-700">
                      ℞ Needs script check
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <b className="block font-display text-[24px] font-semibold tracking-[-.02em]">
                    {formatNaira(o.subtotal)}
                  </b>
                  <button
                    onClick={() => setFee(o)}
                    className="mt-1 text-[13px] font-semibold text-brand-700 hover:underline"
                  >
                    {o.delivery_fee != null
                      ? `+ ${formatNaira(o.delivery_fee)} delivery`
                      : 'Set delivery fee'}
                  </button>
                  <p className="mt-1 text-[12.5px] uppercase tracking-[.06em] text-ink-mute">
                    {o.payment}
                    {o.paid ? ' · paid' : ''}
                  </p>
                </div>
              </div>

              <ul className="mt-4 grid gap-1.5 rounded-lg bg-paper px-4 py-3">
                {o.order_items?.map((it) => (
                  <li key={it.id} className="flex justify-between text-[14px]">
                    <span className="truncate text-ink-soft">
                      {it.qty} × {it.name}
                    </span>
                    <span className="ml-4 shrink-0 font-semibold">
                      {formatNaira(it.price * it.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(o, s)}
                    className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-colors ${
                      o.status === s
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-line bg-white hover:border-brand-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Users({ me }) {
  const [rows, setRows] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, phone, area, role, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
    setRows(data || [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setRole = async (u, role) => {
    if (u.id === me?.id) return alert('You cannot change your own role.')
    await supabase.from('profiles').update({ role }).eq('id', u.id)
    load()
  }

  if (rows === null) return <Skeleton rows={5} />
  if (!rows.length) return <Empty text="No registered customers yet." />

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-xs">
      <div className="hidden grid-cols-[1fr_150px_110px_130px] gap-4 border-b border-line bg-[#F8FAFC] px-5 py-3 text-[13px] font-semibold uppercase tracking-[.06em] text-ink-mute lg:grid">
        <span>Customer</span>
        <span>Joined</span>
        <span>Role</span>
        <span className="text-right">Action</span>
      </div>
      <div className="divide-y divide-line">
        {rows.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_150px_110px_130px]"
          >
            <div className="min-w-0">
              <p className="truncate text-[14.5px] font-semibold">{u.full_name || '—'}</p>
              <p className="text-[12.5px] text-ink-soft">
                {u.phone || 'no phone'} · {u.area || 'no area'}
              </p>
            </div>
            <span className="hidden text-[13px] text-ink-soft lg:block">
              {new Date(u.created_at).toLocaleDateString('en-NG')}
            </span>
            <span
              className={`hidden w-fit rounded-full border px-3 py-1 text-[13px] font-semibold capitalize lg:block ${
                u.role === 'admin'
                  ? 'border-brand/30 bg-brand-wash text-brand-800'
                  : 'border-line bg-paper text-ink-soft'
              }`}
            >
              {u.role}
            </span>
            <button
              onClick={() => setRole(u, u.role === 'admin' ? 'customer' : 'admin')}
              disabled={u.id === me?.id}
              className="text-right text-[13px] font-semibold text-brand-700 hover:underline disabled:opacity-35"
            >
              {u.role === 'admin' ? 'Revoke' : 'Make admin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Settings() {
  const [store, setStore] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('settings')
      .select('key, value')
      .then(({ data }) => {
        const map = Object.fromEntries((data || []).map((r) => [r.key, r.value]))
        setStore(map.store || { name: '', phone: '', email: '' })
      })
  }, [])

  const save = async (e) => {
    e.preventDefault()
    await supabase.from('settings').upsert({ key: 'store', value: store })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!store) return <Skeleton rows={3} />

  return (
    <div className="grid max-w-[900px] gap-6 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-xl border border-line bg-white p-6 shadow-xs">
        <h2 className="text-[17px] font-semibold">Store details</h2>
        <p className="mt-1 text-[14px] text-ink-soft">
          Shown in the storefront and on order confirmations.
        </p>
        <div className="mt-5 grid gap-4">
          <Field label="Store name" value={store.name} onChange={(v) => setStore({ ...store, name: v })} />
          <Field label="Phone" value={store.phone} onChange={(v) => setStore({ ...store, phone: v })} />
          <Field label="Orders email" value={store.email} onChange={(v) => setStore({ ...store, email: v })} />
        </div>
        <button className="mt-5 flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-[15px] font-bold text-white hover:bg-brand-800">
          {saved ? (
            <>
              <Check className="h-[17px] w-[17px]" /> Saved
            </>
          ) : (
            'Save settings'
          )}
        </button>
      </form>

      <div className="rounded-xl border border-line bg-white p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-wash text-brand-700">
            <Lock className="h-[19px] w-[19px]" />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold">Paystack keys</h2>
            <p className="mt-1 text-[14px] text-ink-soft">
              Never edited here, never stored in the database.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 text-[14px]">
          <div className="rounded-lg border border-line bg-paper px-4 py-3.5">
            <dt className="text-[13px] font-semibold uppercase tracking-[.08em] text-ink-soft">
              Public key (pk_)
            </dt>
            <dd className="mt-1.5 leading-relaxed">
              Safe in the browser. Set{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12.5px]">
                VITE_PAYSTACK_PUBLIC_KEY
              </code>{' '}
              in <code className="font-mono text-[12.5px]">.env</code>.
            </dd>
          </div>
          <div className="rounded-lg border border-rx/25 bg-rx-wash px-4 py-3.5">
            <dt className="text-[13px] font-semibold uppercase tracking-[.08em] text-rx-700">
              Secret key (sk_)
            </dt>
            <dd className="mt-1.5 leading-relaxed text-ink-soft">
              Must never reach the browser. Store as a Supabase Edge Function secret:
              <code className="mt-2 block rounded bg-white px-2 py-1.5 font-mono text-[13px]">
                supabase secrets set PAYSTACK_SECRET_KEY=sk_live_…
              </code>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function StatusPill({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[12.5px] font-semibold capitalize ${
        STATUS_STYLE[status] || STATUS_STYLE.pending
      }`}
    >
      {status}
    </span>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[13px] font-semibold text-ink-soft">{label}</span>
      <input
        type={type}
        required={required}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-white px-4 py-2.5 text-[15px] outline-none focus:border-brand-700"
      />
    </label>
  )
}

const Skeleton = ({ rows = 4 }) => (
  <div className="grid gap-3">
    {Array.from({ length: rows }).map((_, n) => (
      <div
        key={n}
        className="h-20 animate-shimmer rounded-xl bg-[linear-gradient(90deg,#EDF2F7_25%,#E1E9F0_50%,#EDF2F7_75%)] bg-[length:200%_100%]"
      />
    ))}
  </div>
)

const Empty = ({ text }) => (
  <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center">
    <p className="text-[15px] text-ink-soft">{text}</p>
  </div>
)
