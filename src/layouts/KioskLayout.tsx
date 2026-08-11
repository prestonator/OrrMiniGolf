import { useEffect, useRef, useCallback, Suspense } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useKioskStore } from '../store/useKioskStore'

const IDLE_TIMEOUT_MS = 45000 // 45 seconds

export function KioskLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  
  const session = useKioskStore((state) => state.session)
  const clearSession = useKioskStore((state) => state.clearSession)
  const isTimerPaused = useKioskStore((state) => state.isTimerPaused)
  
  const timerRef = useRef<number | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }
    
    // If the timer is paused, we don't start a new one
    if (isTimerPaused) return

    timerRef.current = window.setTimeout(() => {
      clearSession()
      queryClient.clear() // Explicitly clear React Query cache
      navigate('/')
    }, IDLE_TIMEOUT_MS)
  }, [isTimerPaused, clearSession, navigate, queryClient])

  useEffect(() => {
    // Reset timer when component mounts or when `isTimerPaused` changes
    resetTimer()

    const events = ['pointerdown', 'keydown', 'touchstart', 'click']
    const handleActivity = () => resetTimer()

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [resetTimer])

  // Route protection
  const publicRoutes = ['/', '/login', '/quick-round-payment']
  if (!session && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="w-full h-full min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center w-full h-full min-h-[50vh] text-slate-800 dark:text-slate-200">Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
