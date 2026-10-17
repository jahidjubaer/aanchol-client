import { ChevronRight, PackageSearch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ItemThumbs, StatusPill } from '../../components/account/OrderBits.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { useAccount } from '../../context/account.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { orderDate } from '../../utils/orderStatus.js'

function ClaimOrder({ onClaimed }) {
  const { call } = useAccount()
  const [open, setOpen] = useState(false)
  const [number, setNumber] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs uppercase tracking-[0.15em] text-primary underline underline-offset-4">
        Ordered before as a guest? Add that order
      </button>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await call('/api/account/orders/claim', { method: 'POST', body: JSON.stringify({ orderNumber: number }) })
      setNumber('')
      setOpen(false)
      onClaimed()
    } catch (err) {
      setError(err.body?.fields?.orderNumber ?? err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-3 border border-base-300 bg-base-200/50 p-4 sm:grid-cols-[1fr_auto] sm:items-start">
      <TextField
        label="Order number"
        value={number}
        onChange={(e) => setNumber(e.target.value.toUpperCase())}
        placeholder="AN-7KQ2MX"
        error={error}
        hint="From your confirmation or WhatsApp message. It must have been placed with this mobile number."
      />
      <button type="submit" disabled={busy || !number.trim()} className="btn btn-primary uppercase tracking-[0.15em] sm:mt-6">
        Add order
      </button>
    </form>
  )
}

export default function AccountOrders() {
  const { call } = useAccount()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    call('/api/account/orders')
      .then((body) => !cancelled && setOrders(body.orders))
      .catch((err) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
  }, [call, version])

  if (error && !orders) {
    return (
      <p role="alert" className="py-10 text-center text-sm">
        {error.message}{' '}
        <button type="button" onClick={() => setVersion((v) => v + 1)} className="underline underline-offset-4">
          Try again
        </button>
      </p>
    )
  }
  if (!orders) {
    return (
      <div className="grid place-items-center py-20" role="status" aria-label="Loading orders">
        <span className="loading loading-spinner" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {orders.length === 0 ? (
        <div className="py-10 text-center">
          <PackageSearch size={36} strokeWidth={1} className="mx-auto text-secondary" />
          <p className="mt-4 font-display text-2xl">No orders yet</p>
          <p className="mt-1 text-sm opacity-70">Orders you place while signed in appear here.</p>
          <Link to="/collections/new" className="btn btn-primary mt-6 px-8 uppercase tracking-[0.2em]">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-base-300 border-y border-base-300">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/account/orders/${o.id}`} className="flex items-center gap-4 py-4 transition hover:bg-base-200/40">
                <ItemThumbs items={o.items} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg">{o.id}</span>
                    <StatusPill status={o.status} />
                  </p>
                  <p className="mt-0.5 truncate text-sm opacity-70">{o.items.map((i) => i.name).join(', ')}</p>
                  <p className="text-xs opacity-60">
                    {orderDate(o.placedAt)} · {formatPrice(o.total)}
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 opacity-40" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <ClaimOrder onClaimed={() => setVersion((v) => v + 1)} />
    </div>
  )
}
