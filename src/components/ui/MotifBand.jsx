import { useId } from 'react'

// Repeating thin band inspired by a sari border (paar). Inherits colour from text-*.
export default function MotifBand({ className = 'text-gold' }) {
  const id = useId()
  return (
    <svg className={`block h-3 w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="12" cy="6" r="1.2" fill="currentColor" />
          <circle cx="0" cy="6" r="0.9" fill="currentColor" />
          <circle cx="24" cy="6" r="0.9" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
