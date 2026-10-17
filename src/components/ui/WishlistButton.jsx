import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useWishlist } from '../../context/wishlist.js'

// Heart toggle. "overlay" sits on a product photo; "inline" is a full button on the product page.
export default function WishlistButton({ product, variant = 'overlay', className = '' }) {
  const { has, toggle } = useWishlist()
  const saved = has(product.slug)
  const label = saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`

  const heart = (
    <motion.span
      key={saved ? 'on' : 'off'}
      initial={saved ? { scale: 0.6 } : false}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      className="inline-grid"
    >
      <Heart size={18} strokeWidth={1.5} className={saved ? 'fill-primary text-primary' : ''} />
    </motion.span>
  )

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={() => toggle(product)}
        aria-pressed={saved}
        aria-label={label}
        className={`btn btn-ghost btn-lg text-xs uppercase tracking-[0.25em] ${className}`}
      >
        {heart} {saved ? 'Saved to wishlist' : 'Add to wishlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      aria-label={label}
      className={`grid size-10 place-items-center rounded-full bg-base-100/80 backdrop-blur transition hover:bg-base-100 ${className}`}
    >
      {heart}
    </button>
  )
}
