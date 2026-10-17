import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import JamdaniDivider from '../../components/ui/JamdaniDivider.jsx'
import { LogoMark } from '../../components/ui/Logo.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'

// Only same-site paths inside the admin, so ?next= can't send anyone elsewhere.
function safeNext(next) {
  return next?.startsWith('/admin') && !next.startsWith('//') ? next : '/admin'
}

export default function AdminLogin() {
  const { admin, login } = useAdminAuth()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (admin) return <Navigate to={safeNext(params.get('next'))} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-base-100 px-4 py-16">
      <title>{`Admin login | ${BRAND.name}`}</title>
      <div className="w-full max-w-sm">
        <div className="text-center">
          <LogoMark className="mx-auto mb-4 size-14 text-primary" />
          <p className="font-display text-3xl uppercase tracking-[0.3em]">{BRAND.name}</p>
          <p className="mt-1 font-bangla text-sm text-secondary">{BRAND.nameBangla}</p>
          <JamdaniDivider className="my-6" />
          <h1 className="text-2xl">Admin</h1>
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
            />
          </label>
          {error && (
            <p role="alert" className="border border-error/40 bg-error/5 p-3 text-sm text-error">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn btn-primary btn-block mt-2 uppercase tracking-[0.25em]">
            {busy ? <span className="loading loading-spinner loading-sm" /> : <Lock size={14} />} Log in
          </button>
        </form>
      </div>
    </div>
  )
}
