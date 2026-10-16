import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout.jsx'
import Home from '../pages/Home.jsx'
import NotFound from '../pages/NotFound.jsx'
import StyleGuide from '../pages/StyleGuide.jsx'
import Credits from '../pages/Credits.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'style-guide', element: <StyleGuide /> },
      { path: 'credits', element: <Credits /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
