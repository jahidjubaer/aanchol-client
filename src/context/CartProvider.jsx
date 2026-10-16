import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage can be unavailable (private mode); the cart still works for this visit.
    }
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
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

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      addItem,
      has: (slug) => lines.some((l) => l.slug === slug),
    }),
    [lines, addItem],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
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
            <span>
              <span className="font-display text-base">{toast.name}</span> added to your bag
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}
