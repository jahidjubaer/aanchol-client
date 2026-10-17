import { BRAND } from '../../config/brand.js'

// The brand mark: a Jamdani buti (woven flower) inside a diamond, the way motifs sit in the weave.
// The frame takes the text colour; the flower is gold. Same drawing as public/favicon.svg and public/logo.svg.
export function LogoMark({ className = 'size-8', flower = 'var(--color-gold)' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 2.5 45.5 24 24 45.5 2.5 24Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <g fill="currentColor" opacity=".55">
        <path d="M24 6.2 25.4 7.6 24 9 22.6 7.6Z" />
        <path d="M24 39 25.4 40.4 24 41.8 22.6 40.4Z" />
        <path d="M6.2 24 7.6 22.6 9 24 7.6 25.4Z" />
        <path d="M39 24 40.4 22.6 41.8 24 40.4 25.4Z" />
      </g>
      <g fill={flower}>
        <path d="M24 11 28 17 24 21 20 17Z" />
        <path d="M24 37 28 31 24 27 20 31Z" />
        <path d="M11 24 17 20 21 24 17 28Z" />
        <path d="M37 24 31 20 27 24 31 28Z" />
        <g opacity=".7">
          <path d="M19 16.9 21.1 19 19 21.1 16.9 19Z" />
          <path d="M29 16.9 31.1 19 29 21.1 26.9 19Z" />
          <path d="M19 26.9 21.1 29 19 31.1 16.9 29Z" />
          <path d="M29 26.9 31.1 29 29 31.1 26.9 29Z" />
        </g>
      </g>
      <path d="M24 21.2 26.8 24 24 26.8 21.2 24Z" fill="currentColor" />
    </svg>
  )
}

// Mark + name, for menus and the admin. The navbar lays out its own larger version.
export default function Logo({ className = '', markClassName = 'size-7 text-primary' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <span className="font-display text-xl uppercase tracking-[0.3em]">{BRAND.name}</span>
    </span>
  )
}
