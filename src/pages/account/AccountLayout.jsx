import { LogOut } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router'
import { BRAND } from '../../config/brand.js'
import { useAccount } from '../../context/account.js'

const TABS = [
  { to: '/account', label: 'Orders', end: true },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/profile', label: 'Profile' },
]

// /account/*: signed-in customers only.
export default function AccountLayout() {
  const { signedIn, customer, logout } = useAccount()
  const location = useLocation()
  if (!signedIn) return <Navigate to="/account/login" replace state={{ next: location.pathname }} />

  const firstName = customer?.name?.split(' ')[0] ?? ''
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 md:px-8 md:pt-14">
      <title>{`My account | ${BRAND.name}`}</title>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Hello, {firstName}</h1>
          <p className="mt-1 text-sm opacity-60">{customer?.phone}</p>
        </div>
        <button type="button" onClick={logout} className="btn btn-ghost btn-sm text-xs uppercase tracking-[0.15em]">
          <LogOut size={14} strokeWidth={1.5} /> Sign out
        </button>
      </div>

      <nav className="mt-8 flex gap-6 overflow-x-auto border-b border-base-300" aria-label="Account sections">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `-mb-px shrink-0 border-b-2 pb-3 text-xs uppercase tracking-[0.2em] transition ${isActive || (t.end && location.pathname.startsWith('/account/orders')) ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100'}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-8">
        <Outlet />
      </div>
    </div>
  )
}
