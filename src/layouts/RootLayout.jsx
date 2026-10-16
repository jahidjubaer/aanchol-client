import { Outlet, ScrollRestoration } from 'react-router'
import Footer from '../components/layout/Footer.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import CartProvider from '../context/CartProvider.jsx'
import CatalogProvider from '../context/CatalogProvider.jsx'

export default function RootLayout() {
  return (
    <CatalogProvider>
      <CartProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
      </CartProvider>
    </CatalogProvider>
  )
}
