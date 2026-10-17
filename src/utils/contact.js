import { BRAND, DELIVERY_OPTIONS } from '../config/brand.js'

export const phoneLink = () => `tel:${BRAND.phone.replace(/[^\d+]/g, '')}`

// "free" or "৳ 150", for delivery tables.
export const deliveryFee = (fee) => (fee === 0 ? 'free' : `৳ ${fee}`)

export const deliveryRows = () => DELIVERY_OPTIONS.map((o) => [o.label, `${o.eta} · ${deliveryFee(o.fee)}`])
