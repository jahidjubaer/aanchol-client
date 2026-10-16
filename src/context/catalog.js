import { createContext, useContext } from 'react'

export const CatalogContext = createContext(null)

// { products, status: 'loading' | 'ready' | 'error', error, retry, getProduct }
export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
