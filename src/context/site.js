import { createContext, useContext } from 'react'

export const SiteContext = createContext(null)

// { categories, slides, campaign, announcement, homeSections, status, fresh, refresh, getCategory }
export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteProvider')
  return ctx
}
