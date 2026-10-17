import { Heart, ShoppingBag, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router'
import { ProductGridSkeleton } from '../components/ui/CatalogState.jsx'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { BRAND } from '../config/brand.js'
import { useCart } from '../context/cart.js'
import { useCatalog } from '../context/catalog.js'
import { useWishlist } from '../context/wishlist.js'
import { EASE_LUXE } from '../utils/motion.js'
import { isSoldOut } from '../utils/product.js'

const GRID = 'mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4'

function SavedPiece({ product }) {
  const cart = useCart()
  const { remove } = useWishlist()
  const inCart = cart.lines.find((l) => l.slug === product.slug)?.qty ?? 0
  const soldOut = isSoldOut(product)
  const canAdd = !soldOut && inCart < product.stock

  const moveToBag = () => {
    cart.addItem(product)
    remove(product.slug)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: EASE_LUXE }}
    >
      <ProductCard product={product} />
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={moveToBag}
          disabled={!canAdd}
          className="btn btn-primary btn-sm text-[10px] uppercase tracking-[0.2em]"
        >
          <ShoppingBag size={14} strokeWidth={1.5} />
          {soldOut ? 'Sold out' : canAdd ? 'Move to bag' : 'In your bag'}
        </button>
        <button
          type="button"
          onClick={() => remove(product.slug)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="btn btn-ghost btn-sm btn-square"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </motion.li>
  )
}

export default function Wishlist() {
  const { items, slugs } = useWishlist()
  const { status } = useCatalog()

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <title>{`Wishlist | ${BRAND.name}`}</title>
      <SectionHeading as="h1" eyebrow="Saved for later" title="Your wishlist" bangla="পছন্দের তালিকা">
        {items.length > 0 && 'Pieces you love, kept on this device. Handwoven pieces are often one of a kind, so they may not wait long.'}
      </SectionHeading>

      {status === 'loading' && slugs.length > 0 ? (
        <ProductGridSkeleton count={Math.min(slugs.length, 4)} className={GRID} />
      ) : items.length ? (
        <ul className={GRID}>
          <AnimatePresence mode="popLayout">
            {items.map((product) => (
              <SavedPiece key={product.slug} product={product} />
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="mt-6 text-center">
          <Heart size={36} strokeWidth={1} className="mx-auto text-secondary" />
          <p className="mx-auto mt-4 max-w-sm leading-relaxed opacity-75">
            Tap the heart on any piece to save it here.
          </p>
          <JamdaniDivider className="my-6" />
          <Link to="/collections/new" className="btn btn-primary px-8 uppercase tracking-[0.2em]">
            Explore new arrivals
          </Link>
        </div>
      )}
    </div>
  )
}
