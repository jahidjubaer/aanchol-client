import { ChevronRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import SampleBadge from '../../components/admin/SampleBadge.jsx'
import WovenImage from '../../components/ui/WovenImage.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { imageSrc } from '../../utils/image.js'

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'live', label: 'In shop', test: (p) => p.active && p.stock > 0 },
  { id: 'sold-out', label: 'Sold out', test: (p) => p.active && p.stock < 1 },
  { id: 'hidden', label: 'Hidden', test: (p) => !p.active },
]

function StockNote({ product }) {
  if (!product.active) return <span className="text-base-content/50">Hidden from shop</span>
  if (product.stock < 1) return <span className="text-error">Sold out</span>
  return <span className="opacity-70">{product.stock} in stock</span>
}

export default function AdminProducts() {
  const { data, error, reload } = useAdminData('/api/admin/products')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const products = data?.products ?? []
  const term = search.trim().toLowerCase()
  const visible = products
    .filter(FILTERS.find((f) => f.id === filter).test)
    .filter((p) => !term || `${p.name} ${p.nameBangla ?? ''} ${p.color ?? ''}`.toLowerCase().includes(term))

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <title>{`Products | ${BRAND.name} Admin`}</title>

      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-8 md:px-8">
        <div>
          <h1 className="text-3xl md:text-4xl">Products</h1>
          {data && <p className="mt-1 text-sm opacity-60">{products.length} in total</p>}
        </div>
        <Link to="/admin/products/new" className="btn btn-primary btn-sm uppercase tracking-[0.15em]">
          <Plus size={16} /> Add
        </Link>
      </div>

      <div className="px-4 md:px-8">
        <label className="flex items-center gap-2 border border-base-300 bg-base-100 px-3">
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or colour"
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <nav className="mt-2 flex overflow-x-auto border-b border-base-300 px-2 md:px-6" aria-label="Filter products">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 border-b-2 px-3 py-3 text-xs uppercase tracking-[0.15em] transition ${
              filter === f.id ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            {f.label} <span className="opacity-60">{products.filter(f.test).length}</span>
          </button>
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

      {!data && !error && (
        <div className="grid place-items-center py-24">
          <span className="loading loading-spinner" />
        </div>
      )}

      {data && visible.length === 0 && (
        <p className="px-4 py-16 text-center opacity-60">
          {products.length ? 'No products match.' : 'No products yet. Add your first piece.'}
        </p>
      )}

      {visible.length > 0 && (
        <ul className="md:mx-8 md:border-x md:border-base-300">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/admin/products/${p.slug}`}
                className="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-3 transition hover:bg-base-100/60 md:px-6"
              >
                <div className={`h-20 w-15 shrink-0 overflow-hidden bg-base-200 ${p.active ? '' : 'opacity-50'}`}>
                  {p.images[0] ? (
                    <img src={imageSrc(p.images[0], 120)} alt="" className="size-full object-cover" />
                  ) : (
                    <WovenImage base={p.colors.base} motif={p.colors.motif} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2">
                    <span className="truncate font-display text-lg leading-tight">{p.name}</span>
                    {p.sample && <SampleBadge />}
                  </p>
                  <p className="mt-1 text-sm">{formatPrice(p.price)}</p>
                  <p className="text-xs">
                    <StockNote product={p} />
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
