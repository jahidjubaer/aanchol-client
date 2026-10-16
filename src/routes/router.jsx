import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout.jsx'
import Home from '../pages/Home.jsx'
import NotFound from '../pages/NotFound.jsx'
import StyleGuide from '../pages/StyleGuide.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'style-guide', element: <StyleGuide /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
