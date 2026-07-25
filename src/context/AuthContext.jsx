import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isConfigured)

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) return setProfile(null)
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, phone, address, area, role')
      .eq('id', userId)
      .maybeSingle()
    setProfile(data || null)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let alive = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return
      setSession(data.session)
      if (data.session?.user) await loadProfile(data.session.user.id)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!alive) return
      setSession(next)
      if (next?.user) await loadProfile(next.user.id)
      else setProfile(null)
    })

    return () => {
      alive = false
      subscription?.unsubscribe()
    }
  }, [loadProfile])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isConfigured,
      isAdmin: profile?.role === 'admin',

      signUp: async ({ email, password, fullName, phone }) => {
        if (!supabase) return { error: { message: 'Supabase is not configured.' } }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, phone } },
        })
        return { data, error }
      },

      signIn: async ({ email, password }) => {
        if (!supabase) return { error: { message: 'Supabase is not configured.' } }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
      },

      signOut: async () => {
        if (!supabase) return
        await supabase.auth.signOut()
        setProfile(null)
      },

      resetPassword: async (email) => {
        if (!supabase) return { error: { message: 'Supabase is not configured.' } }
        return supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account`,
        })
      },

      updateProfile: async (patch) => {
        if (!supabase || !session?.user) return { error: { message: 'Not signed in.' } }
        const { error } = await supabase
          .from('profiles')
          .update(patch)
          .eq('id', session.user.id)
        if (!error) await loadProfile(session.user.id)
        return { error }
      },

      refreshProfile: () => session?.user && loadProfile(session.user.id),
    }),
    [session, profile, loading, loadProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
