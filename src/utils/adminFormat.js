// Labels and colours for order statuses in the admin.
export const STATUS = {
  pending: { label: 'New', className: 'bg-secondary/15 text-secondary border-secondary/40' },
  confirmed: { label: 'Confirmed', className: 'bg-primary/10 text-primary border-primary/30' },
  shipped: { label: 'Shipped', className: 'bg-info/10 text-info border-info/30' },
  delivered: { label: 'Delivered', className: 'bg-accent/10 text-accent border-accent/30' },
  cancelled: { label: 'Cancelled', className: 'bg-base-300/60 text-base-content/60 border-base-300' },
}

// Wording for the button that moves an order to each status.
export const ACTION_LABEL = {
  confirmed: 'Confirm order',
  shipped: 'Mark shipped',
  delivered: 'Mark delivered',
  cancelled: 'Cancel order',
}

export const STATUS_TABS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const DATE_TIME = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Dhaka',
})

export function formatDateTime(iso) {
  return DATE_TIME.format(new Date(iso))
}

const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function timeAgo(iso, now = Date.now()) {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60000)
  if (Math.abs(minutes) < 60) return RELATIVE.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return RELATIVE.format(hours, 'hour')
  return RELATIVE.format(Math.round(hours / 24), 'day')
}

// Customer phones are stored as 01XXXXXXXXX.
export const telLink = (phone) => `tel:+88${phone}`
export const customerWhatsapp = (phone, text) =>
  `https://wa.me/88${phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`

// <input type="datetime-local"> works in the admin's local time without a zone: "2026-10-20T09:00".
export function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null)

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' })
export const formatDate = (iso) => DATE.format(new Date(iso))

// Where a campaign or slide stands right now.
export function scheduleState({ active, startsAt, endsAt }, now = Date.now()) {
  if (active === false) return 'off'
  if (startsAt && new Date(startsAt).getTime() > now) return 'scheduled'
  if (endsAt && new Date(endsAt).getTime() <= now) return 'ended'
  return 'live'
}

export const SCHEDULE = {
  live: { label: 'Live now', className: 'bg-accent/10 text-accent border-accent/30' },
  scheduled: { label: 'Scheduled', className: 'bg-secondary/15 text-secondary border-secondary/40' },
  ended: { label: 'Ended', className: 'bg-base-300/60 text-base-content/60 border-base-300' },
  off: { label: 'Off', className: 'bg-base-300/60 text-base-content/60 border-base-300' },
}
