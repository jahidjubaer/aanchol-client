import { useCallback, useEffect, useMemo, useState } from 'react'
import { request } from '../utils/api.js'
import { AccountContext } from './account.js'

const STORAGE_KEY = 'aanchol-account'

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return session?.token ? session : null
  } catch {
    return null
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: the sign-in lasts until the tab closes.
  }
}

// The shopper's sign-in. Session is { token, customer }, kept in this browser for 30 days.
export default function AccountProvider({ children }) {
  const [session, setSessionState] = useState(readSession)
  const [serverWishlist, setServerWishlist] = useState(null) // the account's saved list, once loaded

  const setSession = useCallback((next) => {
    writeSession(next)
    setSessionState(next)
    if (!next) setServerWishlist(null)
  }, [])

  const logout = useCallback(() => setSession(null), [setSession])

  // Every account call goes through here, so an ended session signs out everywhere at once.
  const token = session?.token
  const call = useCallback(
    async (path, options = {}) => {
      try {
        return await request(path, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } })
      } catch (err) {
        if (err.status === 401) logout()
        throw err
      }
    },
    [token, logout],
  )

  // Both return the new session ({ token, customer }).
  const start = useCallback(
    async (path, body) => {
      const next = await request(path, { method: 'POST', body: JSON.stringify(body) })
      setSession(next)
      return next
    },
    [setSession],
  )
  const login = useCallback((phone, password) => start('/api/account/login', { phone, password }), [start])
  const register = useCallback((details) => start('/api/account/register', details), [start])

  const setCustomer = useCallback((customer) => setSession(session ? { ...session, customer } : null), [session, setSession])

  // Fresh profile and wishlist once per sign-in (also catches a password changed on another device).
  useEffect(() => {
    if (!token) return
    let cancelled = false
    request('/api/account/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((body) => {
        if (cancelled) return
        setSessionState((s) => {
          const next = s && { ...s, customer: body.customer }
          writeSession(next)
          return next
        })
        setServerWishlist(body.wishlist)
      })
      .catch((err) => !cancelled && err.status === 401 && setSession(null))
    return () => {
      cancelled = true
    }
  }, [token, setSession])

  const value = useMemo(
    () => ({
      customer: session?.customer ?? null,
      token: session?.token ?? null,
      signedIn: Boolean(session),
      register,
      login,
      logout,
      call,
      setCustomer,
      setSession,
      serverWishlist,
      setServerWishlist,
    }),
    [session, register, login, logout, call, setCustomer, setSession, serverWishlist],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}
