import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_SITE } from '../config/siteDefaults.js'
import { request } from '../utils/api.js'
import { SiteContext } from './site.js'

const CACHE_KEY = 'aanchol-site-v1'
const REFRESH_AFTER_MS = 60 * 1000

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    return Array.isArray(cached?.site?.categories) ? cached.site : null
  } catch {
    return null
  }
}

function writeCache(site) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), site }))
  } catch {
    // Storage unavailable: the defaults show until the server answers next visit.
  }
}

// A cached campaign may have ended since it was saved.
const stillRunning = (campaign) => campaign && new Date(campaign.endsAt) > new Date() ? campaign : null

// Categories, hero slides, the running campaign and the home layout, all set in the admin.
// Works like CatalogProvider: the last copy shows at once, fresh content loads in the background.
export default function SiteProvider({ children }) {
  const [site, setSite] = useState(readCache)
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const [fresh, setFresh] = useState(false) // answered by the server this visit, not just the saved copy
  const lastLoaded = useRef(0)

  useEffect(() => {
    let cancelled = false
    request('/api/site')
      .then((body) => {
        if (cancelled) return
        lastLoaded.current = Date.now()
        setSite(body)
        setFailed(false)
        setFresh(true)
        writeCache(body)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const refresh = useCallback(() => setAttempt((a) => a + 1), [])

  useEffect(() => {
    const onFocus = () => {
      if (Date.now() - lastLoaded.current > REFRESH_AFTER_MS) refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  const value = useMemo(() => {
    const current = site ?? DEFAULT_SITE
    const slides = current.slides?.length ? current.slides : DEFAULT_SITE.slides
    return {
      ...current,
      slides,
      // A copy saved before these existed doesn't have them.
      memberTiers: current.memberTiers ?? DEFAULT_SITE.memberTiers,
      giftWrap: current.giftWrap ?? DEFAULT_SITE.giftWrap,
      payments: current.payments ?? DEFAULT_SITE.payments,
      campaign: stillRunning(current.campaign),
      status: site ? 'ready' : failed ? 'error' : 'loading',
      fresh,
      refresh,
      getCategory: (slug) => current.categories.find((c) => c.slug === slug),
    }
  }, [site, failed, fresh, refresh])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
