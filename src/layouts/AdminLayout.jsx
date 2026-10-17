import { LogOut, Store } from 'lucide-react'
import { Link, Navigate, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { LogoMark } from '../components/ui/Logo.jsx'
import { BRAND } from '../config/brand.js'
import { useAdminAuth } from '../context/adminAuth.js'
import AdminAuthProvider from '../context/AdminAuthProvider.jsx'

const SECTIONS = [
  { to: '/admin', label: 'Orders', match: (p) => p === '/admin' || p.startsWith('/admin/orders') },
  { to: '/admin/products', label: 'Products', match: (p) => p.startsWith('/admin/products') },
  { to: '/admin/customers', label: 'Customers', match: (p) => p.startsWith('/admin/customers') },
  { to: '/admin/home', label: 'Home page', match: (p) => p.startsWith('/admin/home') },
  { to: '/admin/campaigns', label: 'Campaigns', match: (p) => p.startsWith('/admin/campaigns') },
  { to: '/admin/categories', label: 'Categories', match: (p) => p.startsWith('/admin/categories') },
]

function AdminShell() {
  const { admin, logout } = useAdminAuth()
  const location = useLocation()
  const onLogin = location.pathname === '/admin/login'

  if (!admin && !onLogin) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/admin/login?next=${next}`} replace />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-base-200/60">
      <meta name="robots" content="noindex, nofollow" />
      {admin && (
        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
            <Link to="/admin" className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <LogoMark className="size-6 text-primary" />
                <span className="font-display text-xl uppercase tracking-[0.25em]">{BRAND.name}</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-secondary">Admin</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="mr-2 hidden text-xs opacity-60 sm:inline">{admin.name}</span>
              <Link to="/" aria-label="View shop" className="grid size-10 place-items-center transition hover:text-primary">
                <Store size={18} strokeWidth={1.4} />
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                className="grid size-10 place-items-center transition hover:text-primary"
              >
                <LogOut size={18} strokeWidth={1.4} />
              </button>
            </div>
          </div>
          <nav className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-4 [scrollbar-width:none] md:px-8" aria-label="Admin sections">
            {SECTIONS.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                className={`shrink-0 border-b-2 pb-2 text-xs uppercase tracking-[0.2em] transition ${
                  s.match(location.pathname) ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {s.label}
              </NavLink>
            ))}
          </nav>
        </header>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminShell />
    </AdminAuthProvider>
  )
}
