// The checkout sum, worked out the same way as the server (services/orders.js), so the total shown
// is the total charged. Rounded to whole taka.
//   subtotal (sale prices) − member discount + delivery + gift wrap − gift card
export function orderTotals({ subtotal, deliveryFee, tier, giftWrapFee = 0, giftCardBalance = 0 }) {
  const memberDiscount = tier ? Math.round((subtotal * tier.percent) / 100) : 0
  const beforeCard = subtotal - memberDiscount + deliveryFee + giftWrapFee
  const fromCard = Math.min(giftCardBalance, beforeCard)
  return { memberDiscount, beforeCard, fromCard, total: beforeCard - fromCard }
}

// The level a spend reaches, from levels sorted by min.
export const tierFor = (spent, tiers) => [...tiers].reverse().find((t) => spent >= t.min) ?? null

// "Cash on delivery", or how a gift card changed what's left to pay.
// An advance by bKash/Nagad is shown separately (components/checkout/PaymentStatus.jsx).
export function paymentNote(order) {
  const p = order.payment
  if (p?.advance > 0) return p.plan === 'full' ? 'Paid by mobile wallet' : 'Advance sent, rest cash on delivery'
  if (order.giftCard?.amount > 0) return order.total === 0 ? 'Paid in full by gift card' : 'Rest by cash on delivery'
  return 'Cash on delivery'
}
