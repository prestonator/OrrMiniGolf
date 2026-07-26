import { createBrowserRouter } from 'react-router-dom'
import { KioskLayout } from './layouts/KioskLayout'
import Home from './pages/Home'
import Game from './pages/Game'
import Login from './pages/Login'
import MapPage from './pages/Map'
import Payment from './pages/Payment'

export const router = createBrowserRouter([
  {
    element: <KioskLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/game', element: <Game /> },
      { path: '/login', element: <Login /> },
      { path: '/map', element: <MapPage /> },
      { path: '/quick-round-payment', element: <Payment mode="quick-round" /> },
      { path: '/visit-payment', element: <Payment mode="visit" /> },
    ],
  },
])

