// Gold divider with a Jamdani-style flower between small diamonds.
export default function JamdaniDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-current opacity-50 md:w-20" />
      <svg viewBox="0 0 120 24" className="h-5 w-auto" fill="currentColor">
        <path d="M10 12l4-4 4 4-4 4z" opacity=".5" />
        <path d="M30 12l4-4 4 4-4 4z" opacity=".8" />
        <g transform="translate(60 12)">
          <path d="M0-11l4 11-4 11-4-11z" />
          <path d="M-11 0l11-4 11 4-11 4z" />
          <circle r="2.2" className="fill-base-100" />
        </g>
        <path d="M82 12l4-4 4 4-4 4z" opacity=".8" />
        <path d="M102 12l4-4 4 4-4 4z" opacity=".5" />
      </svg>
      <span className="h-px w-10 bg-current opacity-50 md:w-20" />
    </div>
  )
}
