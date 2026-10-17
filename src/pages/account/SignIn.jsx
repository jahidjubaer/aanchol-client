import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import JamdaniDivider from '../../components/ui/JamdaniDivider.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { BRAND } from '../../config/brand.js'
import { useAccount } from '../../context/account.js'
import { request } from '../../utils/api.js'
import { whatsappLink } from '../../utils/whatsapp.js'

const BENEFITS = ['Track every order', 'Save your addresses for a faster checkout', 'Keep your wishlist on every device']

// /account/login. Router state can carry { mode: 'register', name, phone, claim: 'AN-XXXXXX', next }
// (e.g. from the order confirmation page), so personal details never go into the address bar.
export default function SignIn() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const account = useAccount()
  const [mode, setMode] = useState(state?.mode === 'register' ? 'register' : 'login')
  const [form, setForm] = useState({ name: state?.name ?? '', phone: state?.phone ?? '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (account.signedIn && !busy) return <Navigate to={state?.next ?? '/account'} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErrors({})
    setFormError(null)
    try {
      const session = mode === 'register' ? await account.register(form) : await account.login(form.phone, form.password)
      // A guest order from the confirmation page joins the new account.
      if (state?.claim) {
        await request('/api/account/orders/claim', {
          method: 'POST',
          body: JSON.stringify({ orderNumber: state.claim }),
          headers: { Authorization: `Bearer ${session?.token ?? ''}` },
        }).catch(() => {})
      }
      navigate(state?.next ?? '/account', { replace: true })
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setFormError(err.body?.fields ? null : err.message)
      setBusy(false)
    }
  }

  const forgotHref = whatsappLink(`Hello ${BRAND.name}, I forgot the password for my account. My mobile number is ${form.phone || '…'}.`)

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 md:grid-cols-[1fr_1.1fr] md:px-8 md:py-20">
      <title>{`${mode === 'register' ? 'Create account' : 'Sign in'} | ${BRAND.name}`}</title>

      <div className="md:pt-10">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
          {mode === 'register' ? 'Join' : 'Welcome back'}
          <br />
          <em className="font-normal">{mode === 'register' ? `the ${BRAND.name} family` : 'to the loom'}</em>
        </h1>
        <p className="mt-2 font-bangla text-lg text-primary">{mode === 'register' ? 'নতুন অ্যাকাউন্ট' : 'স্বাগতম'}</p>
        <JamdaniDivider className="my-6 justify-start" />
        <ul className="grid gap-2 text-sm opacity-80">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <span className="size-1.5 rotate-45 bg-gold" /> {b}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm opacity-60">No account needed to order: you can always check out as a guest.</p>
      </div>

      <div className="border border-base-300 bg-base-100 p-6 md:p-8">
        <div role="tablist" className="grid grid-cols-2 border-b border-base-300">
          {[
            ['login', 'Sign in'],
            ['register', 'Create account'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => {
                setMode(id)
                setErrors({})
                setFormError(null)
              }}
              className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-[0.2em] transition ${mode === id ? 'border-primary text-primary' : 'border-transparent opacity-60'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
          {mode === 'register' && (
            <TextField label="Full name" name="name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
          )}
          <TextField
            label="Mobile number"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            value={form.phone}
            onChange={set('phone')}
            error={errors.phone}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            hint={mode === 'register' ? 'At least 8 characters.' : null}
          />

          {formError && (
            <p role="alert" className="text-sm text-error">
              {formError}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary mt-2 uppercase tracking-[0.2em]">
            {busy && <span className="loading loading-spinner loading-sm" />}
            {mode === 'register' ? 'Create account' : 'Sign in'}
          </button>

          {mode === 'login' ? (
            <a href={forgotHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:text-primary hover:opacity-100">
              <MessageCircle size={14} strokeWidth={1.5} /> Forgot password? Message us
            </a>
          ) : (
            <p className="text-center text-xs opacity-60">
              By creating an account you agree to our <Link to="/contact#exchange" className="underline underline-offset-4">delivery and exchange terms</Link>.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
