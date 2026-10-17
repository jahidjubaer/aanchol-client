import { ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { LoadError, Loading } from '../../components/admin/FormParts.jsx'
import ScheduleBadge from '../../components/admin/ScheduleBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { formatDate } from '../../utils/adminFormat.js'

export default function AdminCampaigns() {
  const { data, error, reload } = useAdminData('/api/admin/campaigns')
  const categories = useAdminData('/api/admin/categories').data?.categories ?? []
  const campaigns = data?.campaigns ?? []
  const nameOf = (slug) => categories.find((c) => c.slug === slug)?.name ?? slug

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <title>{`Campaigns | ${BRAND.name} Admin`}</title>

      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-8 md:px-8">
        <div>
          <h1 className="text-3xl md:text-4xl">Campaigns</h1>
          <p className="mt-1 text-sm opacity-60">Sales like Eid or Pohela Boishakh: prices drop and a popup greets visitors between the dates.</p>
        </div>
        <Link to="/admin/campaigns/new" className="btn btn-primary btn-sm shrink-0 uppercase tracking-[0.15em]">
          <Plus size={16} /> Add
        </Link>
      </div>

      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}
      {data && campaigns.length === 0 && <p className="px-4 py-16 text-center opacity-60">No campaigns yet. Add one for the next festival.</p>}

      {campaigns.length > 0 && (
        <ul className="border-t border-base-300 md:mx-8 md:border-x">
          {campaigns.map((c) => (
            <li key={c.id}>
              <Link
                to={`/admin/campaigns/${c.id}`}
                className="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-4 transition hover:bg-base-100/60 md:px-6"
              >
                <div className="grid size-16 shrink-0 place-items-center bg-primary/5 text-center">
                  <span className="font-display text-2xl leading-none text-primary">
                    {c.percentOff > 0 ? `${c.percentOff}%` : <span className="text-xs uppercase tracking-[0.15em]">Note</span>}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg leading-tight">{c.name}</p>
                  <p className="truncate text-sm opacity-70">{c.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs opacity-80">
                    <ScheduleBadge item={c} />
                    <span>
                      {formatDate(c.startsAt)} – {formatDate(c.endsAt)}
                    </span>
                    <span className="opacity-60">· {c.categories.length ? c.categories.map(nameOf).join(', ') : 'All categories'}</span>
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 opacity-40" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
