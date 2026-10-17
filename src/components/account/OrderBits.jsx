import { useCatalog } from '../../context/catalog.js'
import { imageSrc } from '../../utils/image.js'
import { CUSTOMER_STATUS } from '../../utils/orderStatus.js'
import WovenImage from '../ui/WovenImage.jsx'

export function StatusPill({ status }) {
  const meta = CUSTOMER_STATUS[status] ?? CUSTOMER_STATUS.pending
  return <span className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] whitespace-nowrap ${meta.className}`}>{meta.label}</span>
}

// Small photos of what was ordered; pieces no longer in the shop show their name's initial.
export function ItemThumbs({ items }) {
  const { getProduct } = useCatalog()
  return (
    <div className="flex -space-x-3">
      {items.slice(0, 3).map((i) => {
        const p = getProduct(i.slug)
        return (
          <div key={i.slug} className="h-16 w-12 overflow-hidden border-2 border-base-100 bg-base-200">
            {p?.images[0] ? (
              <img src={imageSrc(p.images[0], 100)} alt="" className="size-full object-cover" />
            ) : p ? (
              <WovenImage base={p.colors.base} motif={p.colors.motif} />
            ) : (
              <span className="grid size-full place-items-center font-display text-lg opacity-60">{i.name[0]}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
