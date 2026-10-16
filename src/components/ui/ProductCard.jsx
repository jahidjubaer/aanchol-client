import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { formatPrice } from '../../utils/formatPrice.js'
import { EASE_LUXE } from '../../utils/motion.js'
import WovenImage from './WovenImage.jsx'

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const { slug, name, subtitle, price, compareAt, badge, image, colors } = product

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-base-200">
        <Link to={`/products/${slug}`} aria-label={name}>
          <motion.div
            className="size-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: EASE_LUXE }}
          >
            {image ? (
              <img src={image} alt={name} loading="lazy" className="size-full object-cover" />
            ) : (
              <WovenImage base={colors.base} motif={colors.motif} />
            )}
          </motion.div>
        </Link>

        {badge && (
          <span className="absolute left-0 top-3 bg-base-100/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] md:left-3">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-base-100/80 backdrop-blur transition hover:bg-base-100"
        >
          <Heart size={18} strokeWidth={1.5} className={liked ? 'fill-primary text-primary' : ''} />
        </button>

        <Link
          to={`/products/${slug}`}
          className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-base-100/95 py-3 text-center text-xs uppercase tracking-[0.25em] transition duration-500 group-hover:translate-y-0 md:block"
        >
          View Details
        </Link>
      </div>

      <div className="pt-3 md:pt-4">
        <h3 className="text-lg leading-snug md:text-xl">
          <Link to={`/products/${slug}`} className="hover:text-primary">
            {name}
          </Link>
        </h3>
        {subtitle && <p className="mt-0.5 text-xs tracking-wide opacity-60 md:text-sm">{subtitle}</p>}
        <p className="mt-1.5 text-sm md:text-base">
          <span className="font-normal">{formatPrice(price)}</span>
          {compareAt && <span className="ml-2 text-xs line-through opacity-50">{formatPrice(compareAt)}</span>}
        </p>
      </div>
    </article>
  )
}
