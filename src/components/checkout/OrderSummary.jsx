import { formatPrice } from '../../utils/formatPrice.js'
import CartLine from '../cart/CartLine.jsx'

export default function OrderSummary({ items, subtotal, delivery }) {
  const total = subtotal + delivery.fee
  return (
    <div>
      <ul className="divide-y divide-base-300">
        {items.map((item) => (
          <CartLine key={item.slug} item={item} compact />
        ))}
      </ul>
      <dl className="mt-2 space-y-2 border-t border-base-300 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="opacity-70">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="opacity-70">Delivery · {delivery.label}</dt>
          <dd>{delivery.fee ? formatPrice(delivery.fee) : 'Free'}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-base-300 pt-3">
          <dt className="eyebrow text-base-content">Total</dt>
          <dd className="font-display text-2xl">{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  )
}
