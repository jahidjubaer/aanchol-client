import { createContext, useContext } from 'react'

export const WishlistContext = createContext(null)

// { slugs, items, count, has(slug), toggle(product), remove(slug) }
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
