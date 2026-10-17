import { Link } from 'react-router'
import { imageSrc, imageSrcSet } from '../../utils/image.js'
import { getSubtitle } from '../../utils/product.js'
import Price from '../ui/Price.jsx'
import WovenImage from '../ui/WovenImage.jsx'
import QtyStepper from './QtyStepper.jsx'

// One product row, used in the cart drawer (editable) and checkout summary (read-only).
export default function CartLine({ item, onQty, onRemove, onNavigate, compact = false }) {
  const { product, qty } = item
  const [image] = product.images

  return (
    <li className="flex gap-4 py-4">
      <Link
        to={`/products/${product.slug}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden bg-base-200 ${compact ? 'h-20 w-16' : 'h-28 w-21'}`}
      >
        {image ? (
          <img src={imageSrc(image, 160)} srcSet={imageSrcSet(image, 160)} alt={product.name} className="size-full object-cover" />
        ) : (
          <WovenImage base={product.colors.base} motif={product.colors.motif} />
        )}
        {compact && (
          <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-neutral text-[10px] text-neutral-content">
            {qty}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <Link
            to={`/products/${product.slug}`}
            onClick={onNavigate}
            className="font-display text-lg leading-snug hover:text-primary"
          >
            {product.name}
          </Link>
          <Price product={product} qty={qty} className="shrink-0 text-right text-sm" />
        </div>
        <p className="mt-0.5 text-xs opacity-60">{getSubtitle(product)}</p>

        {!compact && (
          <div className="mt-auto flex items-center justify-between pt-3">
            <QtyStepper value={qty} max={product.stock} onChange={onQty} label={product.name} />
            <button type="button" onClick={onRemove} className="text-xs underline underline-offset-4 opacity-70">
              Remove
            </button>
          </div>
        )}
      </div>
    </li>
  )
}
