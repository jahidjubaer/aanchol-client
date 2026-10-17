import { ChevronLeft, ChevronRight, Gift, RefreshCw, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import SampleBadge from '../../components/admin/SampleBadge.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { formatDateTime, STATUS, STATUS_TABS, timeAgo } from '../../utils/adminFormat.js'
import { formatPrice } from '../../utils/formatPrice.js'

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border-b-2 px-3 py-3 text-xs uppercase tracking-[0.15em] transition ${
        active ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100'
      }`}
    >
      {children}
    </button>
  )
}

function OrderRow({ order }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0)
  return (
    <li>
      <Link
        to={`/admin/orders/${order.id}`}
        className="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-4 transition hover:bg-base-100/60 md:px-6"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm tracking-[0.12em]">{order.id}</span>
            <StatusBadge status={order.status} />
            {order.sample && <SampleBadge />}
            {order.giftWrap && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-secondary">
                <Gift size={12} strokeWidth={1.5} /> Gift wrap
              </span>
            )}
          </div>
          <p className="mt-1.5 truncate">{order.customer.name}</p>
          <p className="truncate text-xs opacity-60">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · {order.customer.city} ·{' '}
            <time dateTime={order.createdAt} title={formatDateTime(order.createdAt)}>
              {timeAgo(order.createdAt)}
            </time>
          </p>
        </div>
        <span className="whitespace-nowrap font-display text-lg">{formatPrice(order.total)}</span>
        <ChevronRight size={16} className="shrink-0 opacity-40" />
      </Link>
    </li>
  )
}

export default function AdminOrders() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const q = params.get('q') ?? ''
  const page = Number(params.get('page')) || 1
  const [search, setSearch] = useState(q)

  const query = new URLSearchParams()
  if (status) query.set('status', status)
  if (q) query.set('q', q)
  if (page > 1) query.set('page', page)
  const { data, error, loading, reload } = useAdminData(`/api/admin/orders?${query}`)

  const update = (changes) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (!('page' in changes)) next.delete('page')
    setParams(next, { replace: true })
  }

  // Search as you type, after a short pause.
  useEffect(() => {
    if (search.trim() === q) return
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params)
      if (search.trim()) next.set('q', search.trim())
      else next.delete('q')
      next.delete('page')
      setParams(next, { replace: true })
    }, 350)
    return () => clearTimeout(timer)
  }, [search, q, params, setParams])

  const counts = data?.counts ?? {}
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <title>{`${counts.pending ? `(${counts.pending}) ` : ''}Orders | ${BRAND.name} Admin`}</title>

      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-8 md:px-8">
        <div>
          <h1 className="text-3xl md:text-4xl">Orders</h1>
          {counts.pending > 0 && (
            <p className="mt-1 text-sm text-secondary">
              {counts.pending} new {counts.pending === 1 ? 'order needs' : 'orders need'} a call
            </p>
          )}
        </div>
        <button type="button" onClick={reload} aria-label="Refresh" className="grid size-10 place-items-center">
          <RefreshCw size={18} strokeWidth={1.4} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="px-4 md:px-8">
        <label className="flex items-center gap-2 border border-base-300 bg-base-100 px-3">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order number, phone or name"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <nav className="mt-2 flex overflow-x-auto border-b border-base-300 px-2 md:px-6" aria-label="Filter by status">
        <Tab active={!status} onClick={() => update({ status: '' })}>
          All <span className="opacity-60">{allCount}</span>
        </Tab>
        {STATUS_TABS.map((s) => (
          <Tab key={s} active={status === s} onClick={() => update({ status: s })}>
            {STATUS[s].label} <span className="opacity-60">{counts[s] ?? 0}</span>
          </Tab>
        ))}
      </nav>

      {error && !data && (
        <div className="m-4 border border-error/40 bg-error/5 p-4 text-sm md:mx-8">
          {error.message}{' '}
          <button type="button" onClick={reload} className="underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {data && data.orders.length === 0 && (
        <p className="px-4 py-16 text-center opacity-60 md:px-8">
          {q ? `No orders match “${q}”.` : status ? `No ${STATUS[status].label.toLowerCase()} orders.` : 'No orders yet.'}
        </p>
      )}

      {data && data.orders.length > 0 && (
        <ul className={`transition-opacity md:mx-8 md:border-x md:border-base-300 ${loading ? 'opacity-60' : ''}`}>
          {data.orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </ul>
      )}

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between px-4 pt-6 text-sm md:px-8">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => update({ page: page - 1 > 1 ? String(page - 1) : '' })}
            className="btn btn-ghost btn-sm"
          >
            <ChevronLeft size={16} /> Newer
          </button>
          <span className="opacity-60">
            Page {data.page} of {data.pages}
          </span>
          <button
            type="button"
            disabled={page >= data.pages}
            onClick={() => update({ page: String(page + 1) })}
            className="btn btn-ghost btn-sm"
          >
            Older <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
