import { Heart, MessageCircle, Minus, Plus, User, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { BRAND } from '../../config/brand.js'
import { useAccount } from '../../context/account.js'
import { useWishlist } from '../../context/wishlist.js'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'
import { useNavLinks } from '../../hooks/useNavLinks.js'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'
import Logo from '../ui/Logo.jsx'
import { EASE_LUXE } from '../../utils/motion.js'

// A category with types opens to show them (Wood, Carved...); the name itself goes to the category.
function MenuLink({ link, onClose }) {
  const [expanded, setExpanded] = useState(false)
  const types = link.category?.status === 'live' ? (link.category.types ?? []) : []
  return (
    <div className="border-b border-base-300">
      <div className="flex items-center gap-3">
        <NavLink
          to={link.to}
          onClick={onClose}
          className={({ isActive }) => `flex flex-1 items-baseline justify-between py-4 ${isActive ? 'text-primary' : ''}`}
        >
          <span className="font-display text-3xl">{link.label}</span>
          <span className="font-bangla text-sm text-secondary">{link.bangla}</span>
        </NavLink>
        {types.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Hide' : 'Show'} ${link.label} types`}
            className="grid size-10 place-items-center"
          >
            {expanded ? <Minus size={18} strokeWidth={1.4} /> : <Plus size={18} strokeWidth={1.4} />}
          </button>
        )}
      </div>
      {expanded && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 pb-4 pl-1 text-sm">
          {types.map((t) => (
            <li key={t.slug}>
              <Link to={`${link.to}?type=${t.slug}`} onClick={onClose} className="opacity-80">
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function MobileMenu({ open, onClose }) {
  useLockBodyScroll(open)
  const navLinks = useNavLinks()
  const { count: wishlistCount } = useWishlist()
  const { signedIn } = useAccount()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.aside
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-base-100 pb-[env(safe-area-inset-bottom)]"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Logo />
              <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-10 place-items-center">
                <X size={22} strokeWidth={1.4} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pt-6">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE_LUXE }}
                  >
                    <MenuLink link={link} onClose={onClose} />
                  </motion.li>
                ))}
              </ul>

              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 text-xs uppercase tracking-[0.2em]">
                {[
                  { label: 'Gift cards', to: '/gift-cards' },
                  { label: 'Membership', to: '/membership' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} onClick={onClose} className={({ isActive }) => `py-2 ${isActive ? 'text-primary' : 'opacity-75'}`}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.2em]">
                <Link to="/account" onClick={onClose} className="flex items-center gap-2 py-2">
                  <User size={16} strokeWidth={1.4} /> {signedIn ? 'My account' : 'Sign in'}
                </Link>
                <Link to="/wishlist" onClick={onClose} className="flex items-center gap-2 py-2">
                  <Heart size={16} strokeWidth={1.4} /> Wishlist{wishlistCount > 0 && ` (${wishlistCount})`}
                </Link>
              </div>
            </nav>

            <div className="bg-base-200 px-5 py-6 text-center">
              <JamdaniDivider className="mb-4" />
              <p className="text-sm opacity-70">Need help choosing a sari?</p>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent btn-block mt-3 uppercase tracking-[0.2em]"
              >
                <MessageCircle size={18} strokeWidth={1.5} /> Chat on WhatsApp
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
