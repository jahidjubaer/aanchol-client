import { motion } from 'motion/react'
import { Link } from 'react-router'
import { getSubtitle, isSoldOut, percentOff } from '../../utils/product.js'
import { imageSrc, imageSrcSet } from '../../utils/image.js'
import { EASE_LUXE } from '../../utils/motion.js'
import Price from './Price.jsx'
import WishlistButton from './WishlistButton.jsx'
import WovenImage from './WovenImage.jsx'

export default function ProductCard({ product }) {
  const { slug, name, badge, images, colors } = product
  const [image, hoverImage] = images
  const soldOut = isSoldOut(product)
  const off = product.salePrice !== undefined ? percentOff(product) : 0

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-base-200">
        <Link to={`/products/${slug}`} aria-label={name}>
          <motion.div
            className={`relative size-full ${soldOut ? 'opacity-60 grayscale-[40%]' : ''}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: EASE_LUXE }}
          >
            {image ? (
              <img
                src={imageSrc(image, 500)}
                srcSet={imageSrcSet(image, 500)}
                alt={name}
                loading="lazy"
                className="size-full object-cover"
              />
            ) : (
              <WovenImage base={colors.base} motif={colors.motif} />
            )}
            {hoverImage && (
              <img
                src={imageSrc(hoverImage, 500)}
                srcSet={imageSrcSet(hoverImage, 500)}
                alt=""
                loading="lazy"
                className="absolute inset-0 hidden size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:block"
              />
            )}
          </motion.div>
        </Link>

        {soldOut ? (
          <span className="absolute left-0 top-3 bg-neutral px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-content md:left-3">
            Sold out
          </span>
        ) : off > 0 ? (
          <span className="absolute left-0 top-3 bg-primary px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary-content md:left-3">
            {off}% off
          </span>
        ) : badge && (
          <span className="absolute left-0 top-3 bg-base-100/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] md:left-3">
            {badge}
          </span>
        )}

        <WishlistButton product={product} className="absolute right-2 top-2" />

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
        <p className="mt-0.5 text-xs tracking-wide opacity-60 md:text-sm">{getSubtitle(product)}</p>
        <p className="mt-1.5 text-sm md:text-base">
          <Price product={product} className="font-normal" />
        </p>
      </div>
    </article>
  )
}
