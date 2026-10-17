import { formatPrice } from '../../utils/formatPrice.js'
import CartLine from '../cart/CartLine.jsx'
import OrderExtras from './OrderExtras.jsx'

// extras: { member, giftWrap, giftCard } as they'll appear on the order; total: what's left to pay.
export default function OrderSummary({ items, subtotal, delivery, extras = {}, total = subtotal + delivery.fee }) {
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
        <OrderExtras order={{ member: extras.member }} />
        <div className="flex justify-between">
          <dt className="opacity-70">Delivery · {delivery.label}</dt>
          <dd>{delivery.fee ? formatPrice(delivery.fee) : 'Free'}</dd>
        </div>
        <OrderExtras order={{ giftWrap: extras.giftWrap, giftCard: extras.giftCard }} />
        <div className="flex items-baseline justify-between border-t border-base-300 pt-3">
          <dt className="eyebrow text-base-content">{extras.giftCard?.amount > 0 ? 'To pay' : 'Total'}</dt>
          <dd className="font-display text-2xl">{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  )
}
