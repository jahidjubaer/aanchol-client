const STATES = {
  pending: { label: 'Waiting for payment', className: 'border-warning/60 bg-warning/10 text-warning' },
  active: { label: 'Active', className: 'border-accent/50 bg-accent/10 text-accent' },
  used: { label: 'Used up', className: 'border-base-300 opacity-70' },
  expired: { label: 'Expired', className: 'border-base-300 opacity-70' },
  cancelled: { label: 'Cancelled', className: 'border-base-300 opacity-60 line-through' },
}

// A gift card's state in the admin: waiting for payment, active, used up, expired or cancelled.
export default function GiftStateBadge({ state }) {
  const s = STATES[state] ?? STATES.pending
  return <span className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${s.className}`}>{s.label}</span>
}
