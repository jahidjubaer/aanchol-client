import { Gift, Ticket, X } from 'lucide-react'
import { useState } from 'react'
import { request } from '../../utils/api.js'
import { formatPrice } from '../../utils/formatPrice.js'

export const GIFT_MESSAGE_MAX = 200

// Gift wrap with a message card, and paying with a gift card.
// wrap: { on, message } · card: { code, balance } once applied, else null.
export default function GiftOptions({ wrapSettings, wrap, onWrapChange, card, onCardChange, cardError: serverCardError, fromCard }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const cardError = error ?? serverCardError

  const apply = async () => {
    if (!code.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const { giftCard } = await request('/api/gift-cards/check', { method: 'POST', body: JSON.stringify({ code }) })
      onCardChange({ code: giftCard.code, balance: giftCard.balance })
      setCode('')
    } catch (err) {
      setError(err.body?.fields?.giftCard ?? err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-4">
      {wrapSettings.enabled && (
        <div className={`border p-4 transition ${wrap.on ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={wrap.on}
              onChange={(e) => onWrapChange({ ...wrap, on: e.target.checked })}
              className="checkbox checkbox-sm checkbox-primary mt-0.5"
            />
            <span className="flex-1">
              <span className="flex items-center gap-2 text-sm">
                <Gift size={16} strokeWidth={1.5} className="text-secondary" /> Gift wrap it
              </span>
              <span className="block text-xs opacity-60">Wrapped in handmade paper, with your message on a card. Prices are left out.</span>
            </span>
            <span className="text-sm">{wrapSettings.fee ? formatPrice(wrapSettings.fee) : 'Free'}</span>
          </label>
          {wrap.on && (
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">
                Message on the card <span className="normal-case tracking-normal opacity-50">(optional)</span>
              </span>
              <textarea
                name="giftMessage"
                rows={3}
                maxLength={GIFT_MESSAGE_MAX}
                value={wrap.message}
                onChange={(e) => onWrapChange({ ...wrap, message: e.target.value })}
                placeholder="Eid Mubarak, Ammu! With love, Nusrat"
                className="textarea w-full font-display text-lg"
              />
              <span className="mt-1 block text-right text-xs opacity-50">
                {wrap.message.length}/{GIFT_MESSAGE_MAX}
              </span>
            </label>
          )}
        </div>
      )}

      <div className="border border-base-300 p-4">
        <p className="flex items-center gap-2 text-sm">
          <Ticket size={16} strokeWidth={1.5} className="text-secondary" /> Gift card
        </p>
        {card ? (
          <div className="mt-3 flex items-center justify-between gap-3 bg-accent/5 px-3 py-2 text-sm">
            <span>
              <span className="font-mono text-xs">{card.code}</span>
              <span className="block text-xs opacity-70">
                Using {formatPrice(fromCard)} of {formatPrice(card.balance)}
                {card.balance > fromCard && `, ${formatPrice(card.balance - fromCard)} stays on the card`}
              </span>
            </span>
            <button type="button" onClick={() => onCardChange(null)} aria-label="Remove gift card" className="grid size-8 place-items-center">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <input
              name="giftCard"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  apply()
                }
              }}
              placeholder="GIFT-XXXX-XXXX"
              autoComplete="off"
              className={`input w-full font-mono uppercase ${cardError ? 'input-error' : ''}`}
            />
            <button type="button" onClick={apply} disabled={busy || !code.trim()} className="btn btn-outline uppercase tracking-[0.15em]">
              {busy ? <span className="loading loading-spinner loading-xs" /> : 'Apply'}
            </button>
          </div>
        )}
        {cardError && !card && <p className="mt-1 text-xs text-error">{cardError}</p>}
      </div>
    </div>
  )
}
