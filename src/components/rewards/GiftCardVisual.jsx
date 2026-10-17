import { BRAND } from '../../config/brand.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { LogoMark } from '../ui/Logo.jsx'
import MotifBand from '../ui/MotifBand.jsx'

// How the gift card looks: maroon with a woven border, the amount and who it's for.
export default function GiftCardVisual({ amount, to, className = '' }) {
  return (
    <div className={`relative aspect-[1.586] w-full max-w-sm overflow-hidden rounded-xl bg-primary p-5 text-primary-content shadow-lg ${className}`}>
      <MotifBand className="absolute inset-x-0 bottom-0 h-4 text-gold-light/60" />
      <LogoMark className="absolute -bottom-12 -right-12 size-52 opacity-10" flower="currentColor" />
      <div className="relative flex h-full flex-col justify-between pb-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <LogoMark className="size-7" flower="var(--color-gold-light)" />
            <span className="font-display text-lg uppercase tracking-[0.3em]">{BRAND.name}</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-light">Gift card</span>
        </div>
        <div>
          <p className="font-display text-4xl">{amount ? formatPrice(amount) : '৳ —'}</p>
          <p className="mt-1 truncate text-sm opacity-80">{to ? `For ${to}` : 'For someone special'}</p>
        </div>
      </div>
    </div>
  )
}
