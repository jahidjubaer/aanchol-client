import { ChevronRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { LoadError, Loading } from '../../components/admin/FormParts.jsx'
import GiftStateBadge from '../../components/admin/GiftStateBadge.jsx'
import SampleBadge from '../../components/admin/SampleBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { formatDate } from '../../utils/adminFormat.js'
import { formatPrice } from '../../utils/formatPrice.js'

const FILTERS = [
  { id: '', label: 'All' },
  { id: 'pending', label: 'Waiting for payment' },
  { id: 'active', label: 'Active' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function AdminGiftCards() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const query = new URLSearchParams({ page: String(page), ...(status ? { status } : {}), ...(search.trim() ? { q: search.trim() } : {}) })
  const { data, error, reload } = useAdminData(`/api/admin/gift-cards?${query}`)
  const cards = data?.giftCards ?? []

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <title>{`Gift cards | ${BRAND.name} Admin`}</title>
      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-8 md:px-8">
        <div>
          <h1 className="text-3xl md:text-4xl">Gift cards</h1>
          <p className="mt-1 text-sm opacity-60">
            {data?.pending ? `${data.pending} waiting for payment. Activate them once the money arrives.` : 'Ordered on the shop, or made here for cards sold in person.'}
          </p>
        </div>
        <Link to="/admin/gift-cards/new" className="btn btn-primary btn-sm shrink-0 uppercase tracking-[0.15em]">
          <Plus size={14} /> New card
        </Link>
      </div>

      <div className="grid gap-3 px-4 md:px-8">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setParams(f.id ? { status: f.id } : {}, { replace: true })
                setPage(1)
              }}
              className={`shrink-0 border px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${status === f.id ? 'border-primary bg-primary text-primary-content' : 'border-base-300 bg-base-100'}`}
            >
              {f.label}
              {f.id === 'pending' && data?.pending > 0 && ` (${data.pending})`}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 border border-base-300 bg-base-100 px-3">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Code, GC- reference, phone or name"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}
      {data && cards.length === 0 && <p className="px-4 py-16 text-center opacity-60">{search || status ? 'No gift cards match.' : 'No gift cards yet.'}</p>}

      {cards.length > 0 && (
        <ul className="mt-4 border-t border-base-300 md:mx-8 md:border-x">
          {cards.map((c) => (
            <li key={c.id}>
              <Link to={`/admin/gift-cards/${c.id}`} className="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-3 transition hover:bg-base-100/60 md:px-6">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl leading-tight">{formatPrice(c.amount)}</span>
                    <GiftStateBadge state={c.state} />
                    {c.sample && <SampleBadge />}
                  </p>
                  <p className="truncate text-sm">
                    For {c.recipient.name}
                    {c.buyer?.name && <span className="opacity-60"> · from {c.buyer.name}</span>}
                  </p>
                  <p className="text-xs opacity-60">
                    {c.reference} · {formatDate(c.createdAt)}
                    {c.state === 'active' && ` · ${formatPrice(c.balance)} left`}
                    {c.payment?.method && !c.payment.paid && ` · pays by ${{ bkash: 'bKash', nagad: 'Nagad' }[c.payment.method] ?? 'cash'}`}
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 opacity-40" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data?.pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn btn-ghost btn-sm">
            Previous
          </button>
          <span className="opacity-60">
            Page {data.page} of {data.pages}
          </span>
          <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="btn btn-ghost btn-sm">
            Next
          </button>
        </div>
      )}
    </div>
  )
}
