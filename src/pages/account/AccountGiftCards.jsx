import { Copy, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAccount } from '../../context/account.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { orderDate } from '../../utils/orderStatus.js'

const STATES = {
  pending: { label: 'Waiting for payment', className: 'border-warning/50 text-warning' },
  active: { label: 'Ready to use', className: 'border-accent/50 text-accent' },
  used: { label: 'Used', className: 'border-base-300 opacity-60' },
  expired: { label: 'Expired', className: 'border-base-300 opacity-60' },
  cancelled: { label: 'Cancelled', className: 'border-base-300 opacity-60' },
}

function CopyCode({ code }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          .writeText(code)
          .then(() => setCopied(true))
          .catch(() => {})
      }
      className="inline-flex items-center gap-2 bg-base-200 px-3 py-1.5 font-mono text-sm"
    >
      {code} <Copy size={13} className="opacity-60" /> <span className="sr-only">Copy</span>
      {copied && <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent">Copied</span>}
    </button>
  )
}

export default function AccountGiftCards() {
  const { call } = useAccount()
  const [cards, setCards] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    call('/api/account/gift-cards')
      .then((body) => !cancelled && setCards(body.giftCards))
      .catch((err) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
  }, [call])

  if (error && !cards) return <p role="alert" className="py-10 text-center text-sm">{error.message}</p>
  if (!cards) {
    return (
      <div className="grid place-items-center py-20" role="status" aria-label="Loading gift cards">
        <span className="loading loading-spinner" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {cards.length === 0 ? (
        <div className="py-10 text-center">
          <Ticket size={36} strokeWidth={1} className="mx-auto text-secondary" />
          <p className="mt-4 font-display text-2xl">No gift cards yet</p>
          <p className="mt-1 text-sm opacity-70">Gift cards you order while signed in appear here, with their codes.</p>
        </div>
      ) : (
        <ul className="divide-y divide-base-300 border-y border-base-300">
          {cards.map((c) => {
            const state = STATES[c.state] ?? STATES.pending
            return (
              <li key={c.reference} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-2xl">{formatPrice(c.amount)}</span>
                    <span className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${state.className}`}>{state.label}</span>
                  </p>
                  <p className="text-xs opacity-60">
                    For {c.recipient.name} · {c.reference} · ordered {orderDate(c.createdAt)}
                    {c.expiresAt && c.state === 'active' && ` · use by ${orderDate(c.expiresAt)}`}
                  </p>
                  {c.code && <div className="mt-2"><CopyCode code={c.code} /></div>}
                </div>
                {c.state === 'active' && <p className="text-sm sm:text-right">{formatPrice(c.balance)} left</p>}
              </li>
            )
          })}
        </ul>
      )}
      <Link to="/gift-cards" className="btn btn-outline justify-self-center px-8 uppercase tracking-[0.2em]">
        Order a gift card
      </Link>
    </div>
  )
}
