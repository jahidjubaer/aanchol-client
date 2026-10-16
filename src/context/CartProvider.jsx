import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CartDrawer from '../components/cart/CartDrawer.jsx'
import { getProduct } from '../data/products.js'
import { EASE_LUXE } from '../utils/motion.js'
import { CartContext } from './cart.js'

const STORAGE_KEY = 'aanchol-cart'

function readStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

// Cart lines are { slug, qty }. Saved in the browser until the backend exists.
export default function CartProvider({ children }) {
  const [lines, setLines] = useState(readStoredCart)
  const [toast, setToast] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage can be unavailable (private mode); the cart still works for this visit.
    }
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const addItem = useCallback((product, qty = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.slug === product.slug)
      if (existing) {
        const nextQty = Math.min(existing.qty + qty, product.stock)
        return current.map((l) => (l.slug === product.slug ? { ...l, qty: nextQty } : l))
      }
      return [...current, { slug: product.slug, qty }]
    })
    setToast({ name: product.name, key: Date.now() })
  }, [])

  const setQty = useCallback((slug, qty) => {
    setLines((current) =>
      qty < 1 ? current.filter((l) => l.slug !== slug) : current.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    )
  }, [])

  const removeItem = useCallback((slug) => setLines((current) => current.filter((l) => l.slug !== slug)), [])
  const clear = useCallback(() => setLines([]), [])
  const openCart = useCallback(() => {
    setToast(null)
    setDrawerOpen(true)
  }, [])
  const closeCart = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo(() => {
    // Products that no longer exist are dropped silently.
    const items = lines
      .map((l) => ({ ...l, product: getProduct(l.slug) }))
      .filter((l) => l.product)
      .map((l) => ({ ...l, qty: Math.min(l.qty, l.product.stock) }))
    return {
      lines,
      items,
      count: items.reduce((sum, l) => sum + l.qty, 0),
      subtotal: items.reduce((sum, l) => sum + l.qty * l.product.price, 0),
      addItem,
      setQty,
      removeItem,
      clear,
      openCart,
      closeCart,
    }
  }, [lines, addItem, setQty, removeItem, clear, openCart, closeCart])

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer open={drawerOpen} onClose={closeCart} />
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            role="status"
            className="fixed inset-x-4 top-4 z-[60] mx-auto flex max-w-sm items-center gap-3 bg-neutral px-5 py-4 text-sm text-neutral-content shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
          >
            <Check size={18} className="shrink-0 text-gold-light" />
            <span className="flex-1">
              <span className="font-display text-base">{toast.name}</span> added to your bag
            </span>
            <button
              type="button"
              onClick={() => {
                setToast(null)
                openCart()
              }}
              className="shrink-0 text-xs uppercase tracking-[0.2em] text-gold-light underline underline-offset-4"
            >
              View
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}
