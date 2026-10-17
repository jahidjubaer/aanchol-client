import { useState } from 'react'
import TextField from '../../components/ui/TextField.jsx'
import { useAccount } from '../../context/account.js'

function Box({ title, children }) {
  return (
    <section className="border border-base-300 bg-base-100 p-5 md:p-6">
      <h2 className="eyebrow mb-5">{title}</h2>
      {children}
    </section>
  )
}

function Details() {
  const { customer, call, setCustomer } = useAccount()
  const [form, setForm] = useState({ name: customer?.name ?? '', email: customer?.email ?? '' })
  const [errors, setErrors] = useState({})
  const [note, setNote] = useState(null)
  const [busy, setBusy] = useState(false)
  const dirty = form.name !== customer?.name || form.email !== (customer?.email ?? '')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setNote(null)
    try {
      const res = await call('/api/account/me', { method: 'PATCH', body: JSON.stringify(form) })
      setCustomer(res.customer)
      setErrors({})
      setNote({ type: 'ok', text: 'Saved.' })
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setNote({ type: 'error', text: err.body?.fields ? 'Please fix the highlighted fields.' : err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box title="Your details">
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <TextField label="Email" optional type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <TextField label="Mobile number" value={customer?.phone ?? ''} disabled hint="Your sign-in number. Message us on WhatsApp to change it." className="sm:col-span-2" />
        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={busy || !dirty} className="btn btn-primary uppercase tracking-[0.15em]">
            Save details
          </button>
          {note && <p className={`text-sm ${note.type === 'error' ? 'text-error' : 'text-accent'}`}>{note.text}</p>}
        </div>
      </form>
    </Box>
  )
}

function Password() {
  const { call, setSession } = useAccount()
  const [form, setForm] = useState({ current: '', password: '' })
  const [errors, setErrors] = useState({})
  const [note, setNote] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setNote(null)
    try {
      setSession(await call('/api/account/password', { method: 'POST', body: JSON.stringify(form) }))
      setForm({ current: '', password: '' })
      setErrors({})
      setNote({ type: 'ok', text: 'Password changed. Other devices have been signed out.' })
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setNote(err.body?.fields ? null : { type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box title="Change password">
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <TextField label="Current password" type="password" autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} error={errors.current} />
        <TextField label="New password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} hint="At least 8 characters." />
        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={busy || !form.current || !form.password} className="btn btn-outline uppercase tracking-[0.15em]">
            Change password
          </button>
          {note && <p className={`text-sm ${note.type === 'error' ? 'text-error' : 'text-accent'}`}>{note.text}</p>}
        </div>
      </form>
    </Box>
  )
}

export default function AccountProfile() {
  return (
    <div className="grid gap-4">
      <Details />
      <Password />
    </div>
  )
}
