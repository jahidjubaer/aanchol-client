import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { BRAND } from '../../config/brand.js'
import { useAccount } from '../../context/account.js'
import { useCart } from '../../context/cart.js'
import { useWishlist } from '../../context/wishlist.js'
import { useAnnouncements, useNavLinks } from '../../hooks/useNavLinks.js'
import { useScrolled } from '../../hooks/useScrolled.js'
import { LogoMark } from '../ui/Logo.jsx'
import MotifBand from '../ui/MotifBand.jsx'
import MegaMenu from './MegaMenu.jsx'
import MobileMenu from './MobileMenu.jsx'
import SearchPanel from './SearchPanel.jsx'

const iconProps = { size: 20, strokeWidth: 1.4 }

function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`grid size-10 place-items-center transition hover:text-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function Navbar() {
  const { count: cartCount, openCart } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { signedIn, customer } = useAccount()
  const navLinks = useNavLinks()
  const announcements = useAnnouncements()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdown, setDropdown] = useState(null) // slug of the category whose menu is open
  const closeTimer = useRef(null)
  const scrolled = useScrolled()
  const openCategory = navLinks.find((l) => l.category?.slug === dropdown)?.category

  // A short delay lets the pointer travel from the link down into the menu.
  const showDropdown = (slug) => {
    clearTimeout(closeTimer.current)
    setDropdown(slug)
  }
  const hideDropdown = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setDropdown(null), 150)
  }
  const closeDropdown = () => {
    clearTimeout(closeTimer.current)
    setDropdown(null)
  }

  // "/" opens search on a keyboard, as on most shops.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      setSearchOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {announcements.length > 0 && (
        <div className="bg-primary px-4 py-2 text-center text-[11px] tracking-[0.15em] text-primary-content md:text-xs">
          {announcements[0]}
          {announcements[1] && <span className="hidden sm:inline"> · {announcements[1]}</span>}
        </div>
      )}

      <header
        onMouseLeave={hideDropdown}
        onKeyDown={(e) => e.key === 'Escape' && closeDropdown()}
        className={`sticky top-0 z-40 bg-base-100/95 backdrop-blur transition-shadow duration-500 ${
          scrolled ? 'shadow-[0_1px_0_0_var(--color-base-300)]' : ''
        }`}
      >
        <nav
          className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-2 transition-[height] duration-500 md:px-8 ${
            scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'
          }`}
        >
          {/* Left: menu button on mobile, links on desktop */}
          <div className="flex items-center">
            <IconButton label="Open menu" className="md:hidden" onClick={() => setMenuOpen(true)}>
              <Menu {...iconProps} />
            </IconButton>
            <IconButton label="Search" className="md:hidden" onClick={() => setSearchOpen(true)}>
              <Search {...iconProps} />
            </IconButton>
            <ul className="hidden gap-8 text-xs uppercase tracking-[0.25em] md:flex">
              {navLinks.map((link) => (
                <li
                  key={link.to}
                  onMouseEnter={() => (link.category ? showDropdown(link.category.slug) : hideDropdown())}
                  onFocus={() => link.category && showDropdown(link.category.slug)}
                >
                  <NavLink
                    to={link.to}
                    onClick={closeDropdown}
                    aria-haspopup={link.category ? 'true' : undefined}
                    aria-expanded={link.category ? dropdown === link.category.slug : undefined}
                    className={({ isActive }) =>
                      `relative py-2 transition hover:text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-500 ${
                        isActive ? 'text-primary after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 leading-none md:gap-3" aria-label={`${BRAND.name} home`}>
            <LogoMark
              className={`shrink-0 text-primary transition-[width,height] duration-500 ${scrolled ? 'size-6 md:size-8' : 'size-7 md:size-10'}`}
            />
            <span className="text-left">
              <span className="block font-display text-xl tracking-[0.25em] uppercase md:text-3xl md:tracking-[0.3em]">{BRAND.name}</span>
              <span className="mt-1 block font-bangla text-[11px] text-secondary md:text-xs">{BRAND.nameBangla}</span>
            </span>
          </Link>

          <div className="flex items-center justify-end">
            <IconButton label="Search" className="hidden md:grid" onClick={() => setSearchOpen(true)}>
              <Search {...iconProps} />
            </IconButton>
            <Link
              to="/account"
              aria-label={signedIn ? `My account (${customer?.name ?? ''})` : 'Sign in'}
              className="relative hidden size-10 place-items-center transition hover:text-primary md:grid"
            >
              <User {...iconProps} />
              {signedIn && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" aria-hidden="true" />}
            </Link>
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} saved`}
              className="relative grid size-10 place-items-center transition hover:text-primary"
            >
              <Heart {...iconProps} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-content">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <IconButton label={`Cart, ${cartCount} items`} className="relative" onClick={openCart}>
              <ShoppingBag {...iconProps} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-content">
                  {cartCount}
                </span>
              )}
            </IconButton>
          </div>
        </nav>
        <MotifBand className="h-2 text-gold/40" />
        <AnimatePresence>
          {openCategory && (
            <MegaMenu key={openCategory.slug} category={openCategory} onNavigate={closeDropdown} onMouseEnter={() => showDropdown(openCategory.slug)} />
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
