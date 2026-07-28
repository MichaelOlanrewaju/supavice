import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Arrow, Lock, Check } from '../components/Icons'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signUp, resetPassword, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || '/account'

  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)

    if (mode === 'reset') {
      const { error } = await resetPassword(form.email)
      setBusy(false)
      if (error) return setError(error.message)
      return setNotice('Check your inbox for a reset link.')
    }

    if (mode === 'signup') {
      if (form.password.length < 8) {
        setBusy(false)
        return setError('Password must be at least 8 characters.')
      }
      const { error } = await signUp(form)
      setBusy(false)
      if (error) return setError(error.message)
      return setNotice(
        'Account created. Check your email to confirm the address, then sign in.'
      )
    }

    const { error } = await signIn(form)
    setBusy(false)
    if (error) return setError(error.message)
    navigate(next)
  }

  const titles = {
    signin: 'Welcome back',
    signup: 'Create your account',
    reset: 'Reset your password',
  }
  const subs = {
    signin: 'Sign in to track orders and check out faster.',
    signup: 'Save your details, follow your orders, reorder in one tap.',
    reset: 'We will email you a link to set a new password.',
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-section-sm lg:grid-cols-[1fr_.9fr] lg:items-center">
      {/* ---- form ---- */}
      <div className="mx-auto w-full max-w-[440px]">
        <div className="eyebrow">{mode === 'signup' ? 'New here' : 'Account'}</div>
        <h1 className="mt-3 font-display text-display-md">{titles[mode]}</h1>
        <p className="mt-3 text-[15px] text-ink-soft">{subs[mode]}</p>

        {!isConfigured && (
          <p className="mt-5 rounded-sm border border-rx/25 bg-rx-wash px-4 py-3 text-[13px] leading-relaxed text-rx-700">
            Accounts are not connected yet. Add your Supabase URL and anon key to{' '}
            <code className="font-mono">.env</code> to enable sign in.
          </p>
        )}

        <form onSubmit={submit} className="mt-7 grid gap-3">
          {mode === 'signup' && (
            <>
              <input
                required
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
              />
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="Phone number"
                autoComplete="tel"
                className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
              />
            </>
          )}

          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
          />

          {mode !== 'reset' && (
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder={mode === 'signup' ? 'Password (8+ characters)' : 'Password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="rounded-sm border-[1.5px] border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-700"
            />
          )}

          {error && (
            <p className="rounded-sm border border-rx/25 bg-rx-wash px-4 py-3 text-[13px] text-rx-700">
              {error}
            </p>
          )}
          {notice && (
            <p className="flex items-start gap-2 rounded-sm border border-brand/30 bg-brand-wash px-4 py-3 text-[13px] text-brand-800">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !isConfigured}
            className="btn-primary mt-1 w-full"
          >
            {busy
              ? 'Working…'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'reset'
                  ? 'Send reset link'
                  : 'Sign in'}
            {!busy && <Arrow className="h-[17px] w-[17px]" />}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
          {mode === 'signin' ? (
            <>
              <button
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
                className="font-semibold text-brand-700 hover:underline"
              >
                Create an account
              </button>
              <button
                onClick={() => {
                  setMode('reset')
                  setError('')
                }}
                className="text-ink-soft hover:text-brand-700"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMode('signin')
                setError('')
              }}
              className="font-semibold text-brand-700 hover:underline"
            >
              ← Back to sign in
            </button>
          )}
        </div>

        <p className="mt-8 flex items-start gap-2 text-[12px] leading-relaxed text-ink-mute">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Your details are stored securely and never shared. Prescription documents are visible only
          to the dispensing pharmacist.
        </p>
      </div>

      {/* ---- side panel ---- */}
      <aside className="hidden overflow-hidden rounded-lg bg-ink p-10 text-white lg:block">
        <div className="eyebrow eyebrow-accent">Why sign in</div>
        <h2 className="mt-4 font-display text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.1] tracking-[-.03em]">
          Faster checkout,
          <br />
          every order tracked.
        </h2>
        <ul className="mt-8 grid gap-5">
          {[
            ['Order history', 'Every order you have placed, with status and totals.'],
            ['Saved details', 'Your address and phone filled in automatically.'],
            ['Reorder in one tap', 'Repeat a previous order without hunting for items.'],
            ['Prescription on file', 'Upload once, reuse for refills.'],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/20 text-brand">
                <Check className="h-3.5 w-3.5" />
              </span>
              <div>
                <b className="block text-[14.5px] font-semibold">{t}</b>
                <span className="text-[13px] leading-relaxed text-[#A8BDD0]">{d}</span>
              </div>
            </li>
          ))}
        </ul>
        <Link
          to="/"
          className="mt-9 inline-flex items-center gap-2 text-[13px] font-semibold text-brand hover:underline"
        >
          Keep shopping instead
          <Arrow className="h-3.5 w-3.5" />
        </Link>
      </aside>
    </div>
  )
}
