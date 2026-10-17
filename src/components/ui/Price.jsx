import { formatPrice } from '../../utils/formatPrice.js'
import { percentOff, unitPrice, wasPrice } from '../../utils/product.js'

// Current price, with the full price crossed out during a sale (or the admin's old price).
export default function Price({ product, qty = 1, className = '', showPercent = false }) {
  const was = wasPrice(product)
  const off = percentOff(product)
  return (
    <span className={className}>
      <span className={was ? 'text-primary' : ''}>{formatPrice(unitPrice(product) * qty)}</span>
      {was && (
        <>
          <span className="sr-only">, was </span>
          <span className="ml-2 text-[0.8em] line-through opacity-50">{formatPrice(was * qty)}</span>
        </>
      )}
      {showPercent && off > 0 && <span className="ml-2 text-[0.75em] uppercase tracking-[0.15em] text-primary">{off}% off</span>}
    </span>
  )
}
