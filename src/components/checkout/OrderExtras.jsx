import { formatPrice } from '../../utils/formatPrice.js'

// Member discount, gift wrap and gift card lines for an order (or a checkout in progress).
// `as` is the row element: 'li' inside a list, 'div' inside a <dl>.
export default function OrderExtras({ order, as: Row = 'div', showMessage = false }) {
  const { member, giftWrap, giftCard } = order
  const Label = Row === 'div' ? 'dt' : 'span'
  const Value = Row === 'div' ? 'dd' : 'span'
  return (
    <>
      {member?.discount > 0 && (
        <Row className="flex justify-between gap-4 text-primary">
          <Label>
            {member.tier} member · {member.percent}%
          </Label>
          <Value>− {formatPrice(member.discount)}</Value>
        </Row>
      )}
      {giftWrap && (
        <Row className="flex justify-between gap-4 opacity-70">
          <Label>Gift wrap</Label>
          <Value>{giftWrap.fee ? formatPrice(giftWrap.fee) : 'Free'}</Value>
        </Row>
      )}
      {showMessage && giftWrap?.message && (
        <Row className="border-l-2 border-gold/60 pl-3 font-display text-base italic opacity-80">“{giftWrap.message}”</Row>
      )}
      {giftCard?.amount > 0 && (
        <Row className="flex justify-between gap-4 text-accent">
          <Label>Gift card {giftCard.code && <span className="opacity-60">{giftCard.code}</span>}</Label>
          <Value>− {formatPrice(giftCard.amount)}</Value>
        </Row>
      )}
    </>
  )
}

