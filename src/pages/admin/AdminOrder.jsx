import { ArrowLeft, Check, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import {
  ACTION_LABEL,
  customerWhatsapp,
  formatDateTime,
  STATUS,
  telLink,
  timeAgo,
} from '../../utils/adminFormat.js'
import { formatPrice } from '../../utils/formatPrice.js'

function Card({ title, children, className = '' }) {
  return (
    <section className={`border border-base-300 bg-base-100 p-5 md:p-6 ${className}`}>
      {title && <h2 className="eyebrow mb-4">{title}</h2>}
      {children}
    </section>
  )
}

function Actions({ order, onChange }) {
  const [confirmCancel, setConfirmCancel] = useState(false)
  const forward = order.next.filter((s) => s !== 'cancelled')
  const canCancel = order.next.includes('cancelled')

  if (!order.next.length) {
    return (
      <p className="text-sm opacity-70">
        {order.status === 'delivered' ? 'Delivered and paid. Nothing left to do.' : 'This order was cancelled. Its stock went back to the shop.'}
      </p>
    )
  }

  if (confirmCancel) {
    return (
      <div className="grid gap-3">
        <p className="text-sm">Cancel {order.id}? The saris go back into stock. This can't be undone.</p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onChange({ status: 'cancelled' })} className="btn btn-error btn-outline">
            Yes, cancel
          </button>
          <button type="button" onClick={() => setConfirmCancel(false)} className="btn btn-ghost">
            Keep order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap">
      {forward.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange({ status: s })}
          className="btn btn-primary uppercase tracking-[0.2em] sm:px-8"
        >
          <Check size={16} /> {ACTION_LABEL[s]}
        </button>
      ))}
      {canCancel && (
        <button type="button" onClick={() => setConfirmCancel(true)} className="btn btn-ghost text-error">
          {ACTION_LABEL.cancelled}
        </button>
      )}
    </div>
  )
}

function NoteEditor({ initial, onSave }) {
  const [note, setNote] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const dirty = note.trim() !== saved

  const save = async () => {
    const order = await onSave({ adminNote: note })
    if (order) setSaved(order.adminNote)
  }

  return (
    <div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="e.g. Called, customer will be home after 5 pm"
        className="textarea w-full"
      />
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="opacity-50">Only you can see this.</span>
        <button type="button" onClick={save} disabled={!dirty} className="btn btn-sm btn-outline">
          {dirty ? 'Save note' : 'Saved'}
        </button>
      </div>
    </div>
  )
}

export default function AdminOrder() {
  const { id } = useParams()
  const { call } = useAdminAuth()
  const { data, error, reload, replace } = useAdminData(`/api/admin/orders/${encodeURIComponent(id)}`)
  const [actionError, setActionError] = useState(null)
  const [busy, setBusy] = useState(false)

  const change = async (body) => {
    setBusy(true)
    setActionError(null)
    try {
      const res = await call(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) })
      replace(res)
      return res.order
    } catch (err) {
      setActionError(err.message)
      if (err.status === 409) reload()
    } finally {
      setBusy(false)
    }
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p>{error.status === 404 ? `Order ${id} was not found.` : error.message}</p>
        <Link to="/admin" className="btn btn-outline mt-6">
          All orders
        </Link>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="grid place-items-center py-24">
        <span className="loading loading-spinner" />
      </div>
    )
  }

  const { order } = data
  const { customer } = order
  const firstName = customer.name.split(' ')[0]
  const greeting = `Hello ${firstName}, this is ${BRAND.name} about your order ${order.id}.`

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 md:px-8">
      <title>{`${order.id} | ${BRAND.name} Admin`}</title>
      <Link to="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-sans text-2xl tracking-[0.12em] md:text-3xl">{order.id}</h1>
        <StatusBadge status={order.status} className="text-xs" />
      </div>
      <p className="mt-1 text-sm opacity-60">
        Placed {formatDateTime(order.createdAt)} · {timeAgo(order.createdAt)}
      </p>

      <div className="mt-6 grid gap-4">
        <Card title="Next step">
          <div className={busy ? 'pointer-events-none opacity-60' : ''}>
            <Actions key={order.status} order={order} onChange={change} />
          </div>
          {actionError && (
            <p role="alert" className="mt-3 text-sm text-error">
              {actionError}
            </p>
          )}
        </Card>

        <Card title="Customer">
          <p className="font-display text-2xl">{customer.name}</p>
          <p className="mt-1 text-sm">{customer.phone}</p>
          {customer.email && <p className="text-sm opacity-70">{customer.email}</p>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a href={telLink(customer.phone)} className="btn btn-outline">
              <Phone size={16} strokeWidth={1.5} /> Call
            </a>
            <a href={customerWhatsapp(customer.phone, greeting)} target="_blank" rel="noreferrer" className="btn btn-accent">
              <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
            </a>
          </div>
          <div className="mt-5 border-t border-base-300 pt-4 text-sm">
            <p className="eyebrow mb-1 text-base-content/60">Deliver to · {order.delivery.label}</p>
            <p className="leading-relaxed">
              {customer.address}, {customer.city}
            </p>
          </div>
          {customer.note && (
            <div className="mt-4 border-l-2 border-secondary bg-secondary/5 p-3 text-sm">
              <p className="eyebrow mb-1">Customer's note</p>
              <p>{customer.note}</p>
            </div>
          )}
        </Card>

        <Card title="Items">
          <ul className="divide-y divide-base-300">
            {order.items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-4 py-3 first:pt-0">
                <span>
                  <Link to={`/products/${i.slug}`} target="_blank" className="hover:text-primary">
                    {i.name}
                  </Link>
                  <span className="block text-xs opacity-60">
                    {formatPrice(i.price)} × {i.qty}
                    {i.listPrice && <span className="ml-1 line-through">{formatPrice(i.listPrice)}</span>}
                  </span>
                </span>
                <span className="whitespace-nowrap">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 grid gap-1 border-t border-base-300 pt-3 text-sm">
            <div className="flex justify-between opacity-70">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.campaign && (
              <div className="flex justify-between text-primary">
                <dt>{order.campaign.name ?? order.campaign.title}</dt>
                <dd>{order.campaign.percentOff}% off applied</dd>
              </div>
            )}
            <div className="flex justify-between opacity-70">
              <dt>Delivery · {order.delivery.label}</dt>
              <dd>{order.delivery.fee ? formatPrice(order.delivery.fee) : 'Free'}</dd>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <dt>
                <span className="eyebrow block text-base-content">Total</span>
                <span className="text-xs opacity-60">
                  Cash on delivery · {order.payment.paid ? 'Paid' : 'Not paid yet'}
                </span>
              </dt>
              <dd className="font-display text-2xl">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Private note">
          <NoteEditor key={order.id} initial={order.adminNote} onSave={change} />
        </Card>

        <Card title="History">
          <ol className="grid gap-3 text-sm">
            {[...order.statusHistory].reverse().map((h) => (
              <li key={`${h.status}-${h.at}`} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-secondary" />
                <span>
                  {STATUS[h.status]?.label ?? h.status}
                  <span className="block text-xs opacity-60">
                    {formatDateTime(h.at)} · {h.by === 'customer' ? 'placed by customer' : h.by}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}
