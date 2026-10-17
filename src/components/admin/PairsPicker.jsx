import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useAdminData } from '../../hooks/useAdminData.js'
import { imageSrc } from '../../utils/image.js'
import WovenImage from '../ui/WovenImage.jsx'

const MAX_PAIRS = 6
const SHOWN = 6

function Thumb({ product }) {
  return (
    <span className="block size-10 shrink-0 overflow-hidden bg-base-200">
      {product?.images?.[0] ? <img src={imageSrc(product.images[0], 100)} alt="" className="size-full object-cover" /> : <WovenImage base={product?.colors?.base} motif={product?.colors?.motif} />}
    </span>
  )
}

// "Complete the look": choose other pieces to show with this one, in order.
export default function PairsPicker({ value, onChange, self, error }) {
  const { data } = useAdminData('/api/admin/products')
  const [search, setSearch] = useState('')
  const all = data?.products ?? []
  const bySlug = new Map(all.map((p) => [p.slug, p]))
  const term = search.trim().toLowerCase()
  const options = all
    .filter((p) => p.slug !== self && !value.includes(p.slug))
    .filter((p) => !term || p.name.toLowerCase().includes(term) || p.category.includes(term))
    .slice(0, SHOWN)

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 grid gap-2">
          {value.map((slug) => {
            const p = bySlug.get(slug)
            return (
              <li key={slug} className="flex items-center gap-3 border border-base-300 p-2 text-sm">
                <Thumb product={p} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{p?.name ?? slug}</span>
                  {p && (p.stock < 1 || !p.active) && <span className="text-xs text-warning">{p.active ? 'Sold out: hidden from the look for now' : 'Hidden from the shop'}</span>}
                </span>
                <button type="button" onClick={() => onChange(value.filter((s) => s !== slug))} aria-label={`Remove ${p?.name ?? slug}`} className="grid size-8 place-items-center">
                  <X size={16} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {value.length < MAX_PAIRS && (
        <>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pieces to add" className="input w-full" />
          <ul className="mt-2 grid gap-1">
            {options.map((p) => (
              <li key={p.slug}>
                <button type="button" onClick={() => onChange([...value, p.slug])} className="flex w-full items-center gap-3 p-1.5 text-left text-sm hover:bg-base-200">
                  <Thumb product={p} />
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <span className="text-xs opacity-50">{p.category}</span>
                  <Plus size={14} className="opacity-60" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : (
        <p className="mt-2 text-xs opacity-60">Up to {MAX_PAIRS}; the shop shows the first 3 in stock. Leave empty and the shop picks the newest pieces from other categories.</p>
      )}
    </div>
  )
}
