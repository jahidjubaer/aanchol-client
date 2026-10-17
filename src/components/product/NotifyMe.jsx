import { BellRing, Check } from 'lucide-react'
import { useState } from 'react'
import { useAccount } from '../../context/account.js'
import { request } from '../../utils/api.js'

const STORAGE_KEY = 'aanchol-notify'

function readAsked() {
  try {
    const asked = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return asked && typeof asked === 'object' ? asked : {}
  } catch {
    return {}
  }
}

// On a sold-out piece: leave a number and we message on WhatsApp when it's back.
// Remembered in this browser, so the form doesn't come back after asking.
export default function NotifyMe({ product }) {
  const { customer } = useAccount()
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [askedWith, setAskedWith] = useState(() => readAsked()[product.slug] ?? null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await request(`/api/products/${product.slug}/notify`, {
        method: 'POST',
        body: JSON.stringify({ phone, name: customer?.name }),
      })
      setAskedWith(phone)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAsked(), [product.slug]: phone }))
      } catch {
        // Storage unavailable: the request is still saved on our side.
      }
    } catch (err) {
      setError(err.body?.fields?.phone ?? err.message)
    } finally {
      setBusy(false)
    }
  }

  if (askedWith) {
    return (
      <p className="flex items-start gap-3 border border-accent/40 bg-accent/5 p-4 text-sm">
        <Check size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-accent" />
        <span>
          We'll message you on WhatsApp at <span className="whitespace-nowrap">{askedWith}</span> when this piece is back.
        </span>
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="border border-base-300 p-4">
      <p className="flex items-center gap-2 text-sm">
        <BellRing size={16} strokeWidth={1.5} className="text-secondary" /> Tell me when it's back
      </p>
      <p className="mt-1 text-xs opacity-60">Handwoven pieces are sometimes woven again. We'll send one WhatsApp message, nothing else.</p>
      <div className="mt-3 flex gap-2">
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01XXXXXXXXX"
          aria-label="Your mobile number"
          className={`input w-full ${error ? 'input-error' : ''}`}
        />
        <button type="submit" disabled={busy || !phone.trim()} className="btn btn-primary uppercase tracking-[0.15em]">
          {busy ? <span className="loading loading-spinner loading-xs" /> : 'Notify me'}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </form>
  )
}
