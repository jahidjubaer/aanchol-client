import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { useSite } from '../../context/site.js'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'
import { imageSrc } from '../../utils/image.js'
import { EASE_LUXE } from '../../utils/motion.js'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'
import MotifBand from '../ui/MotifBand.jsx'
import SmartLink from '../ui/SmartLink.jsx'

const SEEN_KEY = 'aanchol-campaign-seen'
const SHOW_AFTER_MS = 1500
const ONCE_PER_MS = 24 * 60 * 60 * 1000

// Shown once a day per campaign, and again sooner if the admin edits it.
function alreadySeen(campaign) {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY))
    return seen?.id === campaign.id && seen.version === campaign.version && Date.now() - seen.at < ONCE_PER_MS
  } catch {
    return false
  }
}

function markSeen(campaign) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify({ id: campaign.id, version: campaign.version, at: Date.now() }))
  } catch {
    // Storage unavailable: it may show again next visit, which is fine.
  }
}

const endsOn = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

// The running campaign (e.g. "Eid: 10% off"), shown over the home page shortly after it opens.
export default function CampaignPopup() {
  const { campaign, fresh } = useSite()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)
  useLockBodyScroll(open && pathname === '/')

  // Waits for fresh content, so a campaign that just ended in the saved copy never pops up.
  const eligible = pathname === '/' && fresh && campaign?.popup && !alreadySeen(campaign)

  useEffect(() => {
    if (!eligible) return
    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [eligible])

  const close = useCallback(() => {
    if (campaign) markSeen(campaign)
    setOpen(false)
  }, [campaign])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <AnimatePresence>
      {/* Leaving the home page closes it. */}
      {open && campaign && pathname === '/' && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="campaign-title">
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className={`relative w-full overflow-hidden bg-base-100 shadow-2xl md:max-w-3xl ${campaign.image ? 'md:grid md:grid-cols-[1fr_1.1fr]' : 'md:max-w-lg'}`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: EASE_LUXE }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className={`absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full backdrop-blur transition ${
                campaign.image ? 'bg-base-100/85 md:bg-transparent' : ''
              } hover:text-primary`}
            >
              <X size={20} strokeWidth={1.4} />
            </button>

            {campaign.image && (
              <div className="relative h-44 overflow-hidden sm:h-56 md:h-auto md:min-h-[460px]">
                <motion.img
                  src={imageSrc(campaign.image, 900)}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2.2, ease: EASE_LUXE }}
                />
                <div className="pointer-events-none absolute inset-3 border border-ivory/40" />
              </div>
            )}

            <div className="relative px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-8 text-center md:px-10 md:py-12">
              <MotifBand className="absolute inset-x-0 top-0 h-2 text-gold/40" />
              {campaign.percentOff > 0 && (
                <p className="font-display text-6xl leading-none text-primary md:text-7xl">
                  {campaign.percentOff}
                  <span className="text-3xl md:text-4xl">%</span>
                  <span className="ml-2 align-middle font-sans text-xs uppercase tracking-[0.3em] text-secondary">off</span>
                </p>
              )}
              <h2 id="campaign-title" className="mt-4 text-3xl leading-tight md:text-4xl">
                {campaign.title}
              </h2>
              {campaign.titleBangla && (
                <p lang="bn" className="mt-2 font-bangla text-lg text-primary">
                  {campaign.titleBangla}
                </p>
              )}
              <JamdaniDivider className="my-5" />
              {campaign.message && <p className="mx-auto max-w-sm text-sm leading-relaxed opacity-80">{campaign.message}</p>}
              <p className="mt-3 text-xs uppercase tracking-[0.2em] opacity-60">Until {endsOn(campaign.endsAt)}</p>

              <div className="mt-7 grid gap-2">
                {campaign.ctaLabel && (
                  <SmartLink to={campaign.ctaLink} onClick={close} className="btn btn-primary uppercase tracking-[0.2em]">
                    {campaign.ctaLabel}
                  </SmartLink>
                )}
                <button type="button" onClick={close} className="btn btn-ghost text-xs uppercase tracking-[0.2em] opacity-70">
                  Continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
