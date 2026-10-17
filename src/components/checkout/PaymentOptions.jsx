import { Copy, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '../../utils/formatPrice.js'
import { WALLETS } from '../../utils/payments.js'

function CopyNumber({ number }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          .writeText(number)
          .then(() => setCopied(true))
          .catch(() => {})
      }
      className="inline-flex items-center gap-1.5 font-mono text-base tracking-wider"
    >
      {number} <Copy size={13} className="opacity-60" />
      {copied && <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent">Copied</span>}
    </button>
  )
}

// Step 04 at checkout: send the delivery charge (or everything) by bKash / Nagad "Send Money",
// then type the transaction ID. The rest is cash on delivery.
// value: { method, plan, trxId, sender } · advance: the amount for plan 'advance'.
export default function PaymentOptions({ payments, wallets, value, onChange, errors, advance, toPay, deliveryFee, phone }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value })
  const wallet = WALLETS[value.method]
  const number = payments[value.method]?.number
  const amount = value.plan === 'full' ? toPay : advance
  const advanceIsDelivery = deliveryFee > 0 && advance === deliveryFee

  const plans = [
    {
      id: 'advance',
      title: `Pay ${formatPrice(advance)} now`,
      note: advance >= toPay ? 'That is the whole order.' : `${advanceIsDelivery ? 'The delivery charge' : 'An advance'} to confirm · ${formatPrice(toPay - advance)} on delivery`,
    },
    { id: 'full', title: `Pay all ${formatPrice(toPay)} now`, note: 'Nothing to pay on delivery' },
  ].filter((p) => p.id === 'advance' || advance < toPay)

  return (
    <div className="grid gap-5">
      <p className="text-sm opacity-75">
        To confirm your order, send {advanceIsDelivery ? 'the delivery charge' : `a ${formatPrice(advance)} advance`} by{' '}
        {wallets.map((w) => WALLETS[w].label).join(' or ')}, or pay it all now. The rest is cash on delivery.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((p) => (
          <label key={p.id} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${value.plan === p.id ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
            <input type="radio" name="paymentPlan" value={p.id} checked={value.plan === p.id} onChange={set('plan')} className="radio radio-sm radio-primary mt-0.5" />
            <span>
              <span className="block text-sm">{p.title}</span>
              <span className="block text-xs opacity-60">{p.note}</span>
            </span>
          </label>
        ))}
      </div>

      <div>
        <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Send with</span>
        <div className="flex gap-2">
          {wallets.map((w) => (
            <button
              key={w}
              type="button"
              name="paymentMethod"
              onClick={() => onChange({ ...value, method: w })}
              aria-pressed={value.method === w}
              className={`inline-flex items-center gap-2 border px-4 py-2.5 text-sm transition ${value.method === w ? 'border-primary bg-primary/5' : 'border-base-300'}`}
            >
              <span className="size-2.5 rounded-full" style={{ background: WALLETS[w].color }} aria-hidden="true" />
              {WALLETS[w].label}
            </button>
          ))}
        </div>
        {errors.paymentMethod && <span className="mt-1 block text-xs text-error">{errors.paymentMethod}</span>}
      </div>

      {wallet && (
        <ol className="grid gap-2 border-l-2 bg-base-200/60 p-4 text-sm" style={{ borderColor: wallet.color }}>
          <li>
            1. Open {wallet.label} and choose <strong className="font-normal">Send Money</strong>
          </li>
          <li className="flex flex-wrap items-center gap-x-2">
            2. Send to <CopyNumber number={number} /> <span className="text-xs opacity-60">(personal)</span>
          </li>
          <li>
            3. Amount: <strong className="font-normal">{formatPrice(amount)}</strong>
          </li>
          <li>4. Type the transaction ID (TrxID) from the confirmation message below</li>
        </ol>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Transaction ID (TrxID)</span>
          <input
            name="trxId"
            value={value.trxId}
            onChange={(e) => onChange({ ...value, trxId: e.target.value.toUpperCase() })}
            placeholder="8N7A6B5C4D"
            autoComplete="off"
            className={`input w-full font-mono uppercase ${errors.trxId ? 'input-error' : ''}`}
          />
          {errors.trxId && <span className="mt-1 block text-xs text-error">{errors.trxId}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Sent from (your {wallet?.label ?? 'wallet'} number)</span>
          <input
            name="sender"
            type="tel"
            inputMode="tel"
            value={value.sender}
            onChange={set('sender')}
            placeholder={phone || '01XXXXXXXXX'}
            className={`input w-full ${errors.sender ? 'input-error' : ''}`}
          />
          {errors.sender ? <span className="mt-1 block text-xs text-error">{errors.sender}</span> : <span className="mt-1 block text-xs opacity-50">Leave empty if it's your mobile number above.</span>}
        </label>
      </div>

      <p className="flex items-start gap-2 text-xs opacity-60">
        <ShieldCheck size={14} className="mt-px shrink-0" /> We check every payment by hand, then call to confirm your order. If we can't find it, we'll contact you before anything is sent.
      </p>
    </div>
  )
}
