import { Outlet, ScrollRestoration } from 'react-router'
import CampaignPopup from '../components/home/CampaignPopup.jsx'
import Footer from '../components/layout/Footer.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import CartProvider from '../context/CartProvider.jsx'
import CatalogProvider from '../context/CatalogProvider.jsx'
import SiteProvider from '../context/SiteProvider.jsx'
import WishlistProvider from '../context/WishlistProvider.jsx'

export default function RootLayout() {
  return (
    <SiteProvider>
      <CatalogProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex min-h-dvh flex-col">
              <Navbar />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
              <CampaignPopup />
              <ScrollRestoration />
            </div>
          </WishlistProvider>
        </CartProvider>
      </CatalogProvider>
    </SiteProvider>
  )
}
