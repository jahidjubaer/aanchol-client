import { useId } from 'react'

// Stand-in for product photos until real images arrive: a sari-like field of
// butis (small motifs) with a woven border at the bottom.
export default function WovenImage({ base = '#7a1f2b', motif = '#d9b56a', className = '' }) {
  const id = useId()
  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={`size-full ${className}`}
      role="img"
      aria-label="Product image placeholder"
    >
      <defs>
        <pattern id={`${id}-buti`} width="40" height="40" patternUnits="userSpaceOnUse">
          <g fill={motif} opacity=".85">
            <path d="M20 12l3 8-3 8-3-8z" />
            <path d="M12 20l8-3 8 3-8 3z" />
          </g>
          <circle cx="0" cy="0" r="1.5" fill={motif} opacity=".5" />
          <circle cx="40" cy="40" r="1.5" fill={motif} opacity=".5" />
        </pattern>
        <pattern id={`${id}-paar`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 2l8 8-8 8-8-8z" fill="none" stroke={motif} strokeWidth="1.5" />
          <circle cx="10" cy="10" r="2" fill={motif} />
        </pattern>
      </defs>
      <rect width="300" height="400" fill={base} />
      <rect width="300" height="320" fill={`url(#${id}-buti)`} />
      <rect y="330" width="300" height="2" fill={motif} />
      <rect y="338" width="300" height="40" fill={`url(#${id}-paar)`} />
      <rect y="384" width="300" height="2" fill={motif} />
    </svg>
  )
}
