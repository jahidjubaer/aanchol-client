import { Heart } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { EASE_LUXE } from '../utils/motion.js'
import { useAccount } from './account.js'
import { useCatalog } from './catalog.js'
import { WishlistContext } from './wishlist.js'

const STORAGE_KEY = 'aanchol-wishlist'

function readStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(stored) ? stored.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

// Saved pieces (newest first). Kept in this browser; when signed in, also in the account,
// so the list follows the customer to other devices.
export default function WishlistProvider({ children }) {
  const [slugs, setSlugs] = useState(readStored)
  const [toast, setToast] = useState(null)
  const { getProduct } = useCatalog()
  const { signedIn, token, call, serverWishlist, setServerWishlist } = useAccount()
  const syncedToken = useRef(null) // the login whose list has been merged with this device's

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
    } catch {
      // Storage unavailable (private mode): the wishlist lasts for this visit.
    }
  }, [slugs])

  // Other tabs see the change too.
  useEffect(() => {
    const onStorage = (e) => e.key === STORAGE_KEY && setSlugs(readStored())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // After signing in: pieces saved on this device join the account's list.
  useEffect(() => {
    if (!signedIn || !serverWishlist || syncedToken.current === token) return
    syncedToken.current = token
    const local = readStored()
    const needsMerge = local.some((s) => !serverWishlist.includes(s))
    const merged = needsMerge
      ? call('/api/account/wishlist/merge', { method: 'POST', body: JSON.stringify({ wishlist: local }) })
      : Promise.resolve({ wishlist: serverWishlist })
    merged
      .then((body) => {
        setSlugs(body.wishlist)
        if (needsMerge) setServerWishlist(body.wishlist)
      })
      .catch(() => setSlugs([...new Set([...local, ...serverWishlist])]))
  }, [signedIn, token, serverWishlist, call, setServerWishlist])

  // Signing out clears the list from this device (it stays safe in the account).
  const wasSignedIn = useRef(signedIn)
  useEffect(() => {
    if (wasSignedIn.current && !signedIn) {
      syncedToken.current = null
      setSlugs([])
    }
    wasSignedIn.current = signedIn
  }, [signedIn])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const save = useCallback(
    (next) => {
      setSlugs(next)
      if (signedIn && syncedToken.current === token) {
        call('/api/account/wishlist', { method: 'PUT', body: JSON.stringify({ wishlist: next }) }).catch(() => {
          // Kept on this device; it's merged into the account at the next sign-in.
        })
      }
    },
    [signedIn, token, call],
  )

  const toggle = useCallback(
    (product) => {
      const saved = slugs.includes(product.slug)
      save(saved ? slugs.filter((s) => s !== product.slug) : [product.slug, ...slugs])
      setToast(saved ? null : { name: product.name, key: Date.now() })
    },
    [slugs, save],
  )

  const remove = useCallback((slug) => save(slugs.filter((s) => s !== slug)), [slugs, save])

  const value = useMemo(() => {
    // Pieces no longer in the shop are skipped, but kept in case they come back.
    const items = slugs.map(getProduct).filter(Boolean)
    return { slugs, items, count: items.length, has: (slug) => slugs.includes(slug), toggle, remove }
  }, [slugs, getProduct, toggle, remove])

  return (
    <WishlistContext.Provider value={value}>
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
            <Heart size={18} className="shrink-0 fill-gold-light text-gold-light" />
            <span className="flex-1">
              <span className="font-display text-base">{toast.name}</span> saved to your wishlist
            </span>
            <Link
              to="/wishlist"
              onClick={() => setToast(null)}
              className="shrink-0 text-xs uppercase tracking-[0.2em] text-gold-light underline underline-offset-4"
            >
              View
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </WishlistContext.Provider>
  )
}
