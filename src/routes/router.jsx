import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout.jsx'
import Checkout from '../pages/Checkout.jsx'
import Collection from '../pages/Collection.jsx'
import Credits from '../pages/Credits.jsx'
import Home from '../pages/Home.jsx'
import NotFound from '../pages/NotFound.jsx'
import OrderConfirmed from '../pages/OrderConfirmed.jsx'
import Product from '../pages/Product.jsx'
import StyleGuide from '../pages/StyleGuide.jsx'

// Admin pages load separately, so shoppers never download them.
const lazyPage = (load) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'collections/:slug', element: <Collection /> },
      { path: 'products/:slug', element: <Product /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'order-confirmed', element: <OrderConfirmed /> },
      { path: 'style-guide', element: <StyleGuide /> },
      { path: 'credits', element: <Credits /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    lazy: lazyPage(() => import('../layouts/AdminLayout.jsx')),
    children: [
      { index: true, lazy: lazyPage(() => import('../pages/admin/AdminOrders.jsx')) },
      { path: 'login', lazy: lazyPage(() => import('../pages/admin/AdminLogin.jsx')) },
      { path: 'orders/:id', lazy: lazyPage(() => import('../pages/admin/AdminOrder.jsx')) },
      { path: 'products', lazy: lazyPage(() => import('../pages/admin/AdminProducts.jsx')) },
      { path: 'products/new', lazy: lazyPage(() => import('../pages/admin/AdminProductEdit.jsx')) },
      { path: 'products/:slug', lazy: lazyPage(() => import('../pages/admin/AdminProductEdit.jsx')) },
    ],
  },
])
