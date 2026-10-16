import { useCallback, useMemo, useState } from 'react'
import { request } from '../utils/api.js'
import { AdminAuthContext } from './adminAuth.js'

const STORAGE_KEY = 'aanchol-admin'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: the login lasts until the tab closes.
  }
}

// Session is { token, admin }. The token is sent as a Bearer header; the server checks it on every call.
export default function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  const logout = useCallback(() => {
    writeSession(null)
    setSession(null)
  }, [])

  const login = useCallback(async (email, password) => {
    const next = await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    writeSession(next)
    setSession(next)
  }, [])

  // Every admin call goes through here, so an expired session logs out everywhere at once.
  const call = useCallback(
    async (path, options = {}) => {
      try {
        return await request(path, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${session?.token}` },
        })
      } catch (err) {
        if (err.status === 401) logout()
        throw err
      }
    },
    [session, logout],
  )

  const value = useMemo(() => ({ admin: session?.admin ?? null, login, logout, call }), [session, login, logout, call])
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
