import { ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { LoadError, Loading } from '../../components/admin/FormParts.jsx'
import SampleBadge from '../../components/admin/SampleBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { formatDate } from '../../utils/adminFormat.js'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const query = new URLSearchParams({ page: String(page), ...(search.trim() ? { q: search.trim() } : {}) })
  const { data, error, reload } = useAdminData(`/api/admin/customers?${query}`)
  const customers = data?.customers ?? []

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <title>{`Customers | ${BRAND.name} Admin`}</title>
      <div className="px-4 pb-4 pt-8 md:px-8">
        <h1 className="text-3xl md:text-4xl">Customers</h1>
        <p className="mt-1 text-sm opacity-60">{data ? `${data.total} accounts` : 'People who created an account. Guests appear only in Orders.'}</p>
      </div>

      <div className="px-4 md:px-8">
        <label className="flex items-center gap-2 border border-base-300 bg-base-100 px-3">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by phone or name"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}
      {data && customers.length === 0 && <p className="px-4 py-16 text-center opacity-60">{search ? 'No customers match.' : 'No accounts yet.'}</p>}

      {customers.length > 0 && (
        <ul className="mt-4 border-t border-base-300 md:mx-8 md:border-x">
          {customers.map((c) => (
            <li key={c.id}>
              <Link to={`/admin/customers/${c.id}`} className="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-3 transition hover:bg-base-100/60 md:px-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-xl text-primary">{c.name[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-display text-lg leading-tight">{c.name}</span>
                    {c.sample && <SampleBadge />}
                    {!c.active && <span className="border border-error/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-error">Paused</span>}
                  </p>
                  <p className="text-sm opacity-70">{c.phone}</p>
                  <p className="text-xs opacity-60">
                    {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'} · joined {formatDate(c.createdAt)}
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
