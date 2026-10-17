import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import JamdaniDivider from '../../components/ui/JamdaniDivider.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { BRAND } from '../../config/brand.js'
import { useAccount } from '../../context/account.js'
import { request } from '../../utils/api.js'
import { whatsappLink } from '../../utils/whatsapp.js'

// /account/reset?token=…  The link is made in the admin and sent to the customer on WhatsApp.
export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()
  const { setSession } = useAccount()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      setSession(await request('/api/account/reset', { method: 'POST', body: JSON.stringify({ token, password }) }))
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.body?.fields?.password ?? err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center md:py-24">
      <title>{`New password | ${BRAND.name}`}</title>
      <p className="eyebrow">Your account</p>
      <h1 className="mt-3 text-4xl">Choose a new password</h1>
      <JamdaniDivider className="my-6" />
      {token ? (
        <form onSubmit={submit} noValidate className="grid gap-4 text-left">
          <TextField label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={error} hint="At least 8 characters." />
          <button type="submit" disabled={busy || !password} className="btn btn-primary uppercase tracking-[0.2em]">
            {busy && <span className="loading loading-spinner loading-sm" />} Save and sign in
          </button>
        </form>
      ) : (
        <p className="text-sm opacity-75">This link is incomplete. Please open the full link we sent you.</p>
      )}
      <div className="mt-8 grid gap-3 text-xs uppercase tracking-[0.15em]">
        <a href={whatsappLink(`Hello ${BRAND.name}, my password reset link isn't working.`)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 opacity-70 hover:text-primary">
          <MessageCircle size={14} strokeWidth={1.5} /> Need a new link? Message us
        </a>
        <Link to="/account/login" className="opacity-70 hover:text-primary">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
