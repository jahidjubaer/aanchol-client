import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { BRAND, NAV_LINKS } from '../../config/brand.js'
import { useScrolled } from '../../hooks/useScrolled.js'
import MotifBand from '../ui/MotifBand.jsx'
import MobileMenu from './MobileMenu.jsx'

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

export default function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled()

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-[11px] tracking-[0.15em] text-primary-content md:text-xs">
        {BRAND.announcement[0]}
        <span className="hidden sm:inline"> · {BRAND.announcement[1]}</span>
      </div>

      <header
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
            <IconButton label="Search" className="md:hidden">
              <Search {...iconProps} />
            </IconButton>
            <ul className="hidden gap-8 text-xs uppercase tracking-[0.25em] md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
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

          <Link to="/" className="text-center leading-none" aria-label={`${BRAND.name} home`}>
            <span className="block font-display text-2xl tracking-[0.3em] uppercase md:text-3xl">{BRAND.name}</span>
            <span className="mt-1 block font-bangla text-[11px] text-secondary md:text-xs">{BRAND.nameBangla}</span>
          </Link>

          <div className="flex items-center justify-end">
            <IconButton label="Search" className="hidden md:grid">
              <Search {...iconProps} />
            </IconButton>
            <IconButton label="Account" className="hidden md:grid">
              <User {...iconProps} />
            </IconButton>
            <IconButton label="Wishlist" className="hidden md:grid">
              <Heart {...iconProps} />
            </IconButton>
            <IconButton label={`Cart, ${cartCount} items`} className="relative">
              <ShoppingBag {...iconProps} />
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-content">
                {cartCount}
              </span>
            </IconButton>
          </div>
        </nav>
        <MotifBand className="h-2 text-gold/40" />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
