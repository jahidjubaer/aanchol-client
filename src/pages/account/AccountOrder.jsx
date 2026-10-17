import { ArrowLeft, Check, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ItemThumbs, StatusPill } from '../../components/account/OrderBits.jsx'
import OrderExtras from '../../components/checkout/OrderExtras.jsx'
import PaymentStatus from '../../components/checkout/PaymentStatus.jsx'
import { BRAND } from '../../config/brand.js'
import { useAccount } from '../../context/account.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { paymentNote } from '../../utils/orderTotals.js'
import { CUSTOMER_STATUS, customerStatus, ORDER_STEPS, orderDateTime } from '../../utils/orderStatus.js'
import { whatsappLink } from '../../utils/whatsapp.js'

// Received → Confirmed → On the way → Delivered, with the date each step happened.
function Timeline({ order }) {
  const at = Object.fromEntries(order.timeline.map((t) => [t.status, t.at]))
  if (order.status === 'cancelled') {
    return (
      <p className="border-l-2 border-base-300 pl-4 text-sm opacity-70">
        Cancelled {at.cancelled ? `on ${orderDateTime(at.cancelled)}` : ''}. Message us if you have any questions.
      </p>
    )
  }
  const reached = ORDER_STEPS.indexOf(order.status)
  return (
    <ol className="grid gap-0 sm:grid-cols-4">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= reached
        return (
          <li key={step} className="relative flex gap-3 pb-6 sm:block sm:pb-0 sm:pr-4">
            {i < ORDER_STEPS.length - 1 && (
              <span className={`absolute left-[11px] top-6 h-full w-px sm:left-6 sm:top-[11px] sm:h-px sm:w-full ${i < reached ? 'bg-primary' : 'bg-base-300'}`} />
            )}
            <span className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full border ${done ? 'border-primary bg-primary text-primary-content' : 'border-base-300 bg-base-100'}`}>
              {done && <Check size={12} />}
            </span>
            <span className="sm:mt-3 sm:block">
              <span className={`block text-sm ${done ? '' : 'opacity-50'}`}>{CUSTOMER_STATUS[step].label}</span>
              {at[step] && <span className="block text-xs opacity-60">{orderDateTime(at[step])}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default function AccountOrder() {
  const { id } = useParams()
  const { call } = useAccount()
  const [state, setState] = useState({ order: null, error: null, id: null })

  useEffect(() => {
    let cancelled = false
    call(`/api/account/orders/${encodeURIComponent(id)}`)
      .then((body) => !cancelled && setState({ order: body.order, error: null, id }))
      .catch((error) => !cancelled && setState({ order: null, error, id }))
    return () => {
      cancelled = true
    }
  }, [call, id])

  const back = (
    <Link to="/account" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
      <ArrowLeft size={14} /> All orders
    </Link>
  )

  if (state.id !== id) {
    return (
      <div className="grid place-items-center py-20" role="status" aria-label="Loading order">
        <span className="loading loading-spinner" />
      </div>
    )
  }
  if (state.error) {
    return (
      <div>
        {back}
        <p className="py-10 text-center">{state.error.status === 404 ? 'This order was not found in your account.' : state.error.message}</p>
      </div>
    )
  }

  const { order } = state
  const saved = order.items.reduce((sum, i) => sum + ((i.listPrice ?? i.price) - i.price) * i.qty, 0)

  return (
    <div className="grid gap-8">
      <title>{`Order ${order.id} | ${BRAND.name}`}</title>
      {back}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl">{order.id}</h2>
          <p className="text-sm opacity-60">Placed {orderDateTime(order.placedAt)}</p>
        </div>
        <StatusPill status={customerStatus(order)} />
      </div>

      <section className="border border-base-300 bg-base-100 p-5 md:p-6">
        <p className="mb-5 text-sm opacity-80">{CUSTOMER_STATUS[customerStatus(order)]?.note}</p>
        <Timeline order={order} />
      </section>

      <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="border border-base-300 bg-base-100 p-5 md:p-6">
          <h3 className="eyebrow mb-4">Items</h3>
          <ul className="divide-y divide-base-300">
            {order.items.map((i) => (
              <li key={i.slug} className="flex items-center gap-4 py-3 first:pt-0">
                <ItemThumbs items={[i]} />
                <span className="flex-1">
                  <Link to={`/products/${i.slug}`} className="font-display text-lg hover:text-primary">
                    {i.name}
                  </Link>
                  <span className="block text-xs opacity-60">
                    {formatPrice(i.price)} × {i.qty}
                    {i.listPrice && <span className="ml-1 line-through">{formatPrice(i.listPrice)}</span>}
                  </span>
                </span>
                <span className="text-sm">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 grid gap-1 border-t border-base-300 pt-3 text-sm">
            {saved > 0 && (
              <div className="flex justify-between text-primary">
                <dt>{order.campaign?.title ?? 'Sale discount'}</dt>
                <dd>You saved {formatPrice(saved)}</dd>
              </div>
            )}
            <OrderExtras order={{ member: order.member }} />
            <div className="flex justify-between opacity-70">
              <dt>Delivery · {order.delivery.label}</dt>
              <dd>{order.delivery.fee ? formatPrice(order.delivery.fee) : 'Free'}</dd>
            </div>
            <OrderExtras order={{ giftWrap: order.giftWrap, giftCard: order.giftCard }} showMessage />
            <div className="mt-2 flex items-end justify-between">
              <dt>
                <span className="eyebrow block text-base-content">{order.giftCard ? 'To pay' : 'Total'}</span>
                <span className="text-xs opacity-60">
                  {paymentNote(order)} · {order.payment.paid || order.total === 0 ? 'Paid' : 'Pay on delivery'}
                </span>
              </dt>
              <dd className="font-display text-2xl">{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <PaymentStatus order={order} className="mt-3 border-t border-base-300 pt-3" />
        </div>

        <div className="grid content-start gap-4">
          <div className="border border-base-300 bg-base-100 p-5">
            <h3 className="eyebrow mb-2">Delivering to</h3>
            <p className="text-sm leading-relaxed">
              {order.customer.name}
              <br />
              {order.customer.address}, {order.customer.city}
              <br />
              <span className="opacity-70">{order.customer.phone}</span>
            </p>
          </div>
          <a
            href={whatsappLink(`Hello ${BRAND.name}, I have a question about my order ${order.id}.`)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-accent uppercase tracking-[0.2em]"
          >
            <MessageCircle size={16} strokeWidth={1.5} /> Ask about this order
          </a>
        </div>
      </section>
    </div>
  )
}
