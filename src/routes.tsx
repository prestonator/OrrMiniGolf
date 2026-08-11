import { createBrowserRouter } from 'react-router-dom'
import { KioskLayout } from './layouts/KioskLayout'
import { lazy } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Game = lazy(() => import('./pages/Game'))
const Login = lazy(() => import('./pages/Login'))
const MapPage = lazy(() => import('./pages/Map'))
const Payment = lazy(() => import('./features/payment/components/Payment'))

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

