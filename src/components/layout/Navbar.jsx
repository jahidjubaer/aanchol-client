import { Link, NavLink } from 'react-router'
import { BRAND, NAV_LINKS } from '../../config/brand.js'

// Placeholder navbar; full design (mobile drawer, cart, search) comes in the design task.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="font-display text-2xl tracking-[0.15em] uppercase">
          {BRAND.name}
        </Link>
        <ul className="hidden gap-8 text-sm uppercase tracking-[0.2em] md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-primary')}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
