import { STATUS } from '../../utils/adminFormat.js'

export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS[status] ?? STATUS.pending
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] whitespace-nowrap ${meta.className} ${className}`}
    >
      {meta.label}
    </span>
  )
}
