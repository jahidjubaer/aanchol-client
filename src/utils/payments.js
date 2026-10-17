// bKash / Nagad "Send Money" advance. Same rules as the server (services/payments.js).

export const WALLETS = {
  bkash: { label: 'bKash', color: '#e2136e' },
  nagad: { label: 'Nagad', color: '#f6921e' },
}

// Options switched on in the admin, with a number to send to.
export const enabledWallets = (payments) => Object.keys(WALLETS).filter((w) => payments?.[w]?.enabled && payments[w].number)

// The delivery charge, at least minAdvance (free delivery inside Dhaka still needs it), never more than the order.
export function requiredAdvance(toPay, deliveryFee, minAdvance) {
  if (toPay <= 0) return 0
  return Math.min(toPay, Math.max(deliveryFee, minAdvance))
}

// bKash TrxIDs are 10 letters and digits, Nagad's 8; spaces are ignored.
export const cleanTrxId = (value) => value.toUpperCase().replace(/[\s-]/g, '')
export const TRX_ID = /^[A-Z0-9]{8,12}$/

// An advance that the shop hasn't found in its account yet.
export const paymentToCheck = (order) => order.payment?.advance > 0 && !order.payment.verified

// What's left to collect on delivery.
export const dueOnDelivery = (order) => Math.max(0, order.total - (order.payment?.advance ?? 0))
