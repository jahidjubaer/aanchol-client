import { CircleCheck, MessageCircle } from 'lucide-react'
import { Link, Navigate, useLocation } from 'react-router'
import OrderExtras from '../components/checkout/OrderExtras.jsx'
import PaymentStatus from '../components/checkout/PaymentStatus.jsx'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { BRAND } from '../config/brand.js'
import { orderWhatsappMessage } from '../utils/checkout.js'
import { formatPrice } from '../utils/formatPrice.js'
import { paymentNote } from '../utils/orderTotals.js'
import { whatsappLink } from '../utils/whatsapp.js'

export default function OrderConfirmed() {
  const { order, guest } = useLocation().state ?? {}
  if (!order) return <Navigate to="/" replace />
  const saved = order.items.reduce((sum, i) => sum + ((i.listPrice ?? i.price) - i.price) * i.qty, 0)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
      <title>{`Order ${order.id} | ${BRAND.name}`}</title>
      <Reveal>
        <CircleCheck size={44} strokeWidth={1} className="mx-auto text-accent" />
        <p className="eyebrow mt-6">Order {order.id}</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Thank you, {order.customer.name.split(' ')[0]}</h1>
        <p className="mt-2 font-bangla text-lg text-primary">ধন্যবাদ</p>
        <JamdaniDivider className="my-6" />
        <p className="mx-auto max-w-md leading-relaxed opacity-80">
          We'll call you on <span className="whitespace-nowrap">{order.customer.phone}</span> to confirm, then wrap your
          sari and send it on its way.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-10 bg-base-200 p-6 text-left text-sm">
        <ul className="space-y-2">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-4">
              <span>
                {i.name} <span className="opacity-60">× {i.qty}</span>
              </span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
          {saved > 0 && (
            <li className="flex justify-between gap-4 text-primary">
              <span>{order.campaign?.title ?? 'Sale discount'}</span>
              <span>You saved {formatPrice(saved)}</span>
            </li>
          )}
          <OrderExtras order={{ member: order.member }} as="li" />
          <li className="flex justify-between gap-4 opacity-70">
            <span>Delivery · {order.delivery.label}</span>
            <span>{order.delivery.fee ? formatPrice(order.delivery.fee) : 'Free'}</span>
          </li>
          <OrderExtras order={{ giftWrap: order.giftWrap, giftCard: order.giftCard }} as="li" showMessage />
        </ul>
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-base-300 pt-4">
          <span>
            <span className="eyebrow block text-base-content">{order.giftCard ? 'To pay' : 'Total'}</span>
            <span className="text-xs opacity-60">{paymentNote(order)}</span>
          </span>
          <span className="whitespace-nowrap font-display text-2xl">{formatPrice(order.total)}</span>
        </div>
        <PaymentStatus order={order} className="mt-4 border-t border-base-300 pt-4" />
        <p className="mt-4 opacity-70">
          {order.customer.address}, {order.customer.city}
        </p>
      </Reveal>

      {guest && (
        <Reveal delay={0.2} className="mt-8 border border-secondary/40 bg-secondary/5 p-5 text-left text-sm">
          <p className="font-display text-xl">Track this order</p>
          <p className="mt-1 opacity-75">Create an account with {order.customer.phone} and this order is saved to it, with every update.</p>
          <Link
            to="/account/login"
            state={{ mode: 'register', name: order.customer.name, phone: order.customer.phone, claim: order.id }}
            className="btn btn-outline btn-sm mt-4 uppercase tracking-[0.15em]"
          >
            Create account
          </Link>
        </Reveal>
      )}

      <Reveal delay={0.25} className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappLink(orderWhatsappMessage(order))}
          target="_blank"
          rel="noreferrer"
          className="btn btn-accent uppercase tracking-[0.2em]"
        >
          <MessageCircle size={16} strokeWidth={1.5} /> Send on WhatsApp
        </a>
        <Link to="/collections/jamdani" className="btn btn-outline uppercase tracking-[0.2em]">
          Continue shopping
        </Link>
      </Reveal>
    </div>
  )
}
