import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout.jsx'
import Collection from '../pages/Collection.jsx'
import Credits from '../pages/Credits.jsx'
import Home from '../pages/Home.jsx'
import NotFound from '../pages/NotFound.jsx'
import Product from '../pages/Product.jsx'
import StyleGuide from '../pages/StyleGuide.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'collections/:slug', element: <Collection /> },
      { path: 'products/:slug', element: <Product /> },
      { path: 'style-guide', element: <StyleGuide /> },
      { path: 'credits', element: <Credits /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
