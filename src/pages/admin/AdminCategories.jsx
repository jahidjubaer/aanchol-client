import { ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { LoadError, Loading } from '../../components/admin/FormParts.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { imageSrc } from '../../utils/image.js'

const CATEGORY_STATUS = {
  live: { label: 'Live', className: 'bg-accent/10 text-accent border-accent/30' },
  'coming-soon': { label: 'Coming soon', className: 'bg-secondary/15 text-secondary border-secondary/40' },
  hidden: { label: 'Hidden', className: 'bg-base-300/60 text-base-content/60 border-base-300' },
}

export default function AdminCategories() {
  const { data, error, reload } = useAdminData('/api/admin/categories')
  const products = useAdminData('/api/admin/products').data?.products ?? []
  const categories = data?.categories ?? []
  const countOf = (slug) => products.filter((p) => p.category === slug).length

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <title>{`Categories | ${BRAND.name} Admin`}</title>

      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-8 md:px-8">
        <div>
          <h1 className="text-3xl md:text-4xl">Categories</h1>
          <p className="mt-1 text-sm opacity-60">Your product lines. Add Dhakai Muslin, Manipuri or a men's line here when you're ready.</p>
        </div>
        <Link to="/admin/categories/new" className="btn btn-primary btn-sm shrink-0 uppercase tracking-[0.15em]">
          <Plus size={16} /> Add
        </Link>
      </div>

      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}

      {categories.length > 0 && (
        <ul className="border-t border-base-300 md:mx-8 md:border-x">
          {categories.map((c) => {
            const status = CATEGORY_STATUS[c.status]
            return (
              <li key={c.slug}>
                <Link
                  to={`/admin/categories/${c.slug}`}
                  className="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-3 transition hover:bg-base-100/60 md:px-6"
                >
                  <div className={`h-16 w-16 shrink-0 overflow-hidden bg-neutral ${c.status === 'hidden' ? 'opacity-50' : ''}`}>
                    {c.banner && <img src={imageSrc(c.banner, 160)} alt="" className="size-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg leading-tight">
                      {c.name} {c.nameBangla && <span className="font-bangla text-sm text-secondary">{c.nameBangla}</span>}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${status.className}`}>{status.label}</span>
                      <span className="opacity-60">
                        {countOf(c.slug)} products{c.inNav ? ' · in menu' : ''}
                        {c.types.length > 0 && ` · ${c.types.map((t) => t.label).join(', ')}`}
                      </span>
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 opacity-40" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
