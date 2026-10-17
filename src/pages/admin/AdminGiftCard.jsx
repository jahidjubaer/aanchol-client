import { ArrowLeft, Check, Copy, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { LoadError, Loading, Section } from '../../components/admin/FormParts.jsx'
import GiftStateBadge from '../../components/admin/GiftStateBadge.jsx'
import SampleBadge from '../../components/admin/SampleBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { customerWhatsapp, formatDate, formatDateTime } from '../../utils/adminFormat.js'
import { formatPrice } from '../../utils/formatPrice.js'

// The WhatsApp message with the code, ready to send (or forward) once the card is paid.
function codeMessage(card, toRecipient) {
  const greeting = toRecipient ? `Hello ${card.recipient.name.split(' ')[0]}` : `Hello ${card.buyer?.name?.split(' ')[0] ?? ''}`.trim()
  return [
    `${greeting}, ${toRecipient ? `${card.buyer?.name ?? 'someone special'} sent you` : 'here is'} a ${BRAND.name} gift card for ${formatPrice(card.amount)}.`,
    card.message && `"${card.message}"`,
    `Code: ${card.code}`,
    `Use it at checkout on ${window.location.origin} until ${formatDate(card.expiresAt)}.`,
  ]
    .filter(Boolean)
    .join('\n')
}

function paymentMessage(card) {
  const how = { bkash: 'by bKash Send Money', nagad: 'by Nagad Send Money' }[card.payment.method] ?? 'in cash'
  return `Hello ${card.buyer?.name?.split(' ')[0] ?? ''}, thank you for ordering a ${BRAND.name} gift card (${card.reference}) for ${formatPrice(card.amount)}. Please pay ${how}; we'll send the code as soon as it arrives.`
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          .writeText(text)
          .then(() => setCopied(true))
          .catch(() => {})
      }
      className="btn btn-outline btn-sm"
    >
      <Copy size={14} /> {copied ? 'Copied' : 'Copy code'}
    </button>
  )
}

export default function AdminGiftCard() {
  const { id } = useParams()
  const { call } = useAdminAuth()
  const { data, error, reload, replace } = useAdminData(`/api/admin/gift-cards/${encodeURIComponent(id)}`)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const back = (
    <Link to="/admin/gift-cards" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
      <ArrowLeft size={14} /> All gift cards
    </Link>
  )

  if (error && !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
        {back}
        <LoadError error={error.status === 404 ? { message: 'This gift card was not found.' } : error} onRetry={reload} />
      </div>
    )
  }
  if (!data) return <Loading />
  const card = data.giftCard

  const act = async (path, body) => {
    setBusy(true)
    setProblem(null)
    try {
      const res = await call(`/api/admin/gift-cards/${card.id}${path}`, { method: body ? 'PATCH' : 'POST', ...(body ? { body: JSON.stringify(body) } : {}) })
      replace({ giftCard: res.giftCard })
      setConfirmCancel(false)
    } catch (err) {
      setProblem(err.message)
    } finally {
      setBusy(false)
    }
  }

  const canCancel = card.status === 'pending' || (card.status === 'active' && card.uses.length === 0)

  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pb-16 pt-6 md:px-8">
      <title>{`${card.reference} | ${BRAND.name} Admin`}</title>
      {back}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl md:text-4xl">{formatPrice(card.amount)} gift card</h1>
        <GiftStateBadge state={card.state} />
        {card.sample && <SampleBadge />}
      </div>
      <p className="-mt-2 text-sm opacity-60">
        {card.reference} · {card.createdBy === 'customer' ? 'ordered on the shop' : `made by ${card.createdBy}`} {formatDateTime(card.createdAt)}
      </p>

      {card.status === 'pending' && (
        <Section title="Waiting for payment">
          <p className="text-sm">
            {card.buyer?.name} will pay <strong className="font-normal">{formatPrice(card.amount)}</strong> by {{ bkash: 'bKash', nagad: 'Nagad' }[card.payment.method] ?? 'cash'}. Once the money
            arrives, activate the card: it gets its code and is valid for a year.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" disabled={busy} onClick={() => act('/activate')} className="btn btn-primary">
              <Check size={16} /> Payment received: activate
            </button>
            {card.buyer?.phone && (
              <a href={customerWhatsapp(card.buyer.phone, paymentMessage(card))} target="_blank" rel="noreferrer" className="btn btn-accent">
                <MessageCircle size={16} /> Ask for payment
              </a>
            )}
          </div>
        </Section>
      )}

      {card.code && (
        <Section title="Code" aside={card.state === 'active' && <span className="text-sm">{formatPrice(card.balance)} left</span>}>
          <p className="font-mono text-2xl tracking-[0.1em]">{card.code}</p>
          <p className="mt-1 text-xs opacity-60">
            Activated {formatDateTime(card.activatedAt)} · use by {formatDate(card.expiresAt)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton text={card.code} />
            {card.buyer?.phone && (
              <a href={customerWhatsapp(card.buyer.phone, codeMessage(card, false))} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">
                <MessageCircle size={14} /> Send to buyer
              </a>
            )}
            {card.recipient?.phone && (
              <a href={customerWhatsapp(card.recipient.phone, codeMessage(card, true))} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">
                <MessageCircle size={14} /> Send to {card.recipient.name.split(' ')[0]}
              </a>
            )}
          </div>
        </Section>
      )}

      <Section title="People">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="eyebrow text-base-content/60">From</dt>
            <dd className="mt-1">
              {card.buyer?.name ?? '—'}
              {card.buyer?.phone && <span className="block opacity-70">{card.buyer.phone}</span>}
              {card.customerId && (
                <Link to={`/admin/customers/${card.customerId}`} className="text-xs text-primary underline underline-offset-4">
                  customer account
                </Link>
              )}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-base-content/60">For</dt>
            <dd className="mt-1">
              {card.recipient.name}
              {card.recipient.phone && <span className="block opacity-70">{card.recipient.phone}</span>}
            </dd>
          </div>
        </dl>
        {card.message && <p className="mt-4 border-l-2 border-gold/60 pl-3 font-display text-lg italic">“{card.message}”</p>}
      </Section>

      {card.uses.length > 0 && (
        <Section title="Used on">
          <ul className="divide-y divide-base-300 text-sm">
            {card.uses.map((u, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2">
                <span>
                  {u.orderNumber?.startsWith('AN-') && u.orderNumber !== 'AN-SAMPLE' ? (
                    <Link to={`/admin/orders/${u.orderNumber}`} className="text-primary underline underline-offset-4">
                      {u.orderNumber}
                    </Link>
                  ) : (
                    u.orderNumber
                  )}
                  <span className="block text-xs opacity-60">{formatDateTime(u.at)}</span>
                </span>
                <span className={u.refunded ? 'line-through opacity-60' : ''}>− {formatPrice(u.amount)}</span>
                {u.refunded && <span className="text-xs text-accent">refunded (order cancelled)</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Private note">
        <NoteEditor key={card.adminNote} initial={card.adminNote} busy={busy} onSave={(adminNote) => act('', { adminNote })} />
      </Section>

      {canCancel && (
        <div className="text-right">
          {confirmCancel ? (
            <span className="inline-flex flex-wrap items-center justify-end gap-2 text-sm">
              Cancel this card? It can't be used afterwards.
              <button type="button" disabled={busy} onClick={() => act('/cancel')} className="btn btn-error btn-sm">
                Yes, cancel it
              </button>
              <button type="button" onClick={() => setConfirmCancel(false)} className="btn btn-ghost btn-sm">
                Keep
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmCancel(true)} className="btn btn-ghost btn-sm text-error">
              <X size={14} /> Cancel card
            </button>
          )}
        </div>
      )}
      {problem && (
        <p role="alert" className="text-sm text-error">
          {problem}
        </p>
      )}
    </div>
  )
}

function NoteEditor({ initial, busy, onSave }) {
  const [note, setNote] = useState(initial)
  return (
    <div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500} placeholder="e.g. Paid by bKash, TrxID 8N7…" className="textarea w-full" />
      {note !== initial && (
        <button type="button" disabled={busy} onClick={() => onSave(note)} className="btn btn-primary btn-sm mt-2">
          Save note
        </button>
      )}
    </div>
  )
}
