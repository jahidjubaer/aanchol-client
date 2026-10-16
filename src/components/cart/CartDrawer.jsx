import { ShoppingBag, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { useCart } from '../../context/cart.js'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { EASE_LUXE } from '../../utils/motion.js'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'
import CartLine from './CartLine.jsx'

export default function CartDrawer({ open, onClose }) {
  const { items, count, subtotal, setQty, removeItem } = useCart()
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-base-100 pb-[env(safe-area-inset-bottom)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
          >
            <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
              <p className="font-display text-2xl">
                Your Bag {count > 0 && <span className="text-base opacity-60">({count})</span>}
              </p>
              <button type="button" onClick={onClose} aria-label="Close bag" className="grid size-10 place-items-center">
                <X size={22} strokeWidth={1.4} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={36} strokeWidth={1} className="text-secondary" />
                <p className="mt-4 font-display text-2xl">Your bag is empty</p>
                <p className="mt-1 font-bangla text-sm text-primary">আপনার ব্যাগ খালি</p>
                <JamdaniDivider className="my-6" />
                <Link
                  to="/collections/jamdani"
                  onClick={onClose}
                  className="btn btn-primary px-8 uppercase tracking-[0.2em]"
                >
                  Explore Jamdani
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-base-300 overflow-y-auto px-5">
                  {items.map((item) => (
                    <CartLine
                      key={item.slug}
                      item={item}
                      onQty={(qty) => setQty(item.slug, qty)}
                      onRemove={() => removeItem(item.slug)}
                      onNavigate={onClose}
                    />
                  ))}
                </ul>

                <div className="border-t border-base-300 bg-base-200 px-5 py-5">
                  <div className="flex items-baseline justify-between">
                    <p className="eyebrow text-base-content">Subtotal</p>
                    <p className="font-display text-2xl">{formatPrice(subtotal)}</p>
                  </div>
                  <p className="mt-1 text-xs opacity-60">Delivery is calculated at checkout. Cash on delivery available.</p>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn btn-primary btn-block btn-lg mt-4 uppercase tracking-[0.25em]"
                  >
                    Checkout
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] underline underline-offset-4"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
