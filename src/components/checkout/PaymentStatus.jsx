import { formatPrice } from '../../utils/formatPrice.js'
import { dueOnDelivery, paymentToCheck, WALLETS } from '../../utils/payments.js'

// How an order is being paid: the bKash/Nagad advance (checked or not) and what's left for delivery.
export default function PaymentStatus({ order, className = '' }) {
  const { payment } = order
  const wallet = WALLETS[payment?.method]
  if (!wallet || !(payment.advance > 0)) return null
  const due = dueOnDelivery(order)
  return (
    <dl className={`grid gap-1 text-sm ${className}`}>
      <div className="flex justify-between gap-4">
        <dt>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: wallet.color }} aria-hidden="true" />
            Sent by {wallet.label}
          </span>
          <span className="block text-xs opacity-60">
            TrxID <span className="font-mono">{payment.trxId}</span> · {paymentToCheck(order) ? "we're checking it" : 'received, thank you'}
          </span>
        </dt>
        <dd>{formatPrice(payment.advance)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="opacity-70">On delivery (cash)</dt>
        <dd>{due ? formatPrice(due) : 'Nothing, paid in full'}</dd>
      </div>
    </dl>
  )
}
