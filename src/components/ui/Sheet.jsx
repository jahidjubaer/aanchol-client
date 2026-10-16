import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'
import { EASE_LUXE } from '../../utils/motion.js'

// Bottom sheet for phones: slides up, closes on backdrop tap or Esc.
export default function Sheet({ open, onClose, title, children, footer }) {
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
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-ink/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col bg-base-100 pb-[env(safe-area-inset-bottom)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.55, ease: EASE_LUXE }}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-base-300" />
            <div className="flex items-center justify-between border-b border-base-300 px-5 py-3">
              <p className="font-display text-2xl">{title}</p>
              <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center">
                <X size={22} strokeWidth={1.4} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && <div className="border-t border-base-300 px-5 py-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
