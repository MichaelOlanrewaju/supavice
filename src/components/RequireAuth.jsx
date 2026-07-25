import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Gate a route behind sign-in. `admin` additionally requires the profile role.
 * Renders nothing while the session is still resolving, so a signed-in user is
 * never briefly bounced to the login screen on refresh.
 */
export default function RequireAuth({ children, admin = false }) {
  const { user, isAdmin, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-section text-center">
        <h1 className="font-display text-display-sm">Accounts are not connected</h1>
        <p className="mt-3 text-[15px] text-ink-soft">
          Add your Supabase URL and anon key to <code className="font-mono">.env</code>, then
          restart the dev server.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-section">
        <div className="h-4 w-40 animate-shimmer rounded-sm bg-[linear-gradient(90deg,#F1F5F9_25%,#E4EBF2_50%,#F1F5F9_75%)] bg-[length:200%_100%]" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (admin && !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F4F7FA] px-6 text-center">
        <div className="max-w-[460px]">
          <h1 className="font-display text-display-sm">Not authorised</h1>
          <p className="mt-3 text-[15px] text-ink-soft">
            This area is for store administrators. If that should be you, ask an existing admin to
            update your role.
          </p>
          <a href="/" className="btn-primary mt-6 inline-flex">
            Back to store
          </a>
        </div>
      </div>
    )
  }

  return children
}
