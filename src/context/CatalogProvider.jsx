import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { request } from '../utils/api.js'
import { CatalogContext } from './catalog.js'

const CACHE_KEY = 'aanchol-catalog-v1'
const REFRESH_AFTER_MS = 60 * 1000

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    return Array.isArray(cached?.products) ? cached.products : null
  } catch {
    return null
  }
}

function writeCache(products) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), products }))
  } catch {
    // Storage unavailable: products are simply loaded again next visit.
  }
}

// The whole catalogue is small, so it's loaded once and shared by every page.
// The last copy is kept in the browser: repeat visits show products instantly while
// fresh prices and stock load in the background (the free server can take a while to wake up).
export default function CatalogProvider({ children }) {
  const [products, setProducts] = useState(readCache)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const lastLoaded = useRef(0)

  useEffect(() => {
    let cancelled = false
    request('/api/products')
      .then((body) => {
        if (cancelled) return
        lastLoaded.current = Date.now()
        setProducts(body.products)
        setError(null)
        writeCache(body.products)
      })
      .catch((err) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setError(null)
    setAttempt((a) => a + 1)
  }, [])

  // Coming back to the tab after a while picks up new stock and prices.
  useEffect(() => {
    const onFocus = () => {
      if (Date.now() - lastLoaded.current > REFRESH_AFTER_MS) setAttempt((a) => a + 1)
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const value = useMemo(() => {
    const list = products ?? []
    return {
      products: list,
      status: products ? 'ready' : error ? 'error' : 'loading',
      error,
      retry,
      getProduct: (slug) => list.find((p) => p.slug === slug),
    }
  }, [products, error, retry])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
