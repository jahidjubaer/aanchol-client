import { MessageCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { formatPrice } from '../../utils/formatPrice.js'
import { EASE_LUXE } from '../../utils/motion.js'

// Phone-only bar that slides up once the main buy buttons scroll out of view.
export default function StickyBuyBar({ visible, product, onAdd, whatsappHref, addLabel, addDisabled }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-base-300 bg-base-100/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.5, ease: EASE_LUXE }}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base leading-tight">{product.name}</p>
              <p className="text-sm">{formatPrice(product.price)}</p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Order on WhatsApp"
              className="btn btn-outline btn-accent btn-square"
            >
              <MessageCircle size={18} strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={onAdd}
              disabled={addDisabled}
              className="btn btn-primary px-5 uppercase tracking-[0.15em]"
            >
              {addLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
