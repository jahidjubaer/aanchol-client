// How order statuses read to customers (the admin uses its own wording in adminFormat.js).
export const CUSTOMER_STATUS = {
  pending: { label: 'Order received', note: 'We will call you to confirm.', className: 'bg-secondary/15 text-secondary border-secondary/40' },
  confirmed: { label: 'Confirmed', note: 'Your piece is being wrapped.', className: 'bg-primary/10 text-primary border-primary/30' },
  shipped: { label: 'On the way', note: 'With the courier now.', className: 'bg-info/10 text-info border-info/30' },
  delivered: { label: 'Delivered', note: 'We hope you love it.', className: 'bg-accent/10 text-accent border-accent/30' },
  cancelled: { label: 'Cancelled', note: 'This order was cancelled.', className: 'bg-base-300/60 text-base-content/60 border-base-300' },
}

export const ORDER_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' })
const DATE_TIME = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' })
export const orderDate = (iso) => DATE.format(new Date(iso))
export const orderDateTime = (iso) => DATE_TIME.format(new Date(iso))
