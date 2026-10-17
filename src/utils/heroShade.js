const INK = '43, 29, 22' // --color-ink as rgb

// The shade over a hero photo. "overlay" (0–90) is set per slide in the admin.
// Phones: darker at the bottom where the text sits. Desktop: darker on the text side.
export function heroShade(overlay, align, desktop) {
  const o = overlay / 100
  const a = (x) => `rgba(${INK}, ${Math.min(0.92, x).toFixed(2)})`
  if (!desktop) return `linear-gradient(to top, ${a(o + 0.4)} 0%, ${a(o * 0.7)} 45%, ${a(o * 0.25)} 100%)`
  if (align === 'center') return `radial-gradient(ellipse at center, ${a(o + 0.15)} 0%, ${a(o * 0.6)} 70%, ${a(o * 0.4)} 100%)`
  return `linear-gradient(to right, ${a(o + 0.3)} 0%, ${a(o * 0.75)} 40%, ${a(o * 0.15)} 75%, transparent 100%)`
}
