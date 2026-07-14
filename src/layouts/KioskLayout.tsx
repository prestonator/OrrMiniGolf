import { useEffect, useRef, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useKioskStore } from '../store/useKioskStore'

const IDLE_TIMEOUT_MS = 45000 // 45 seconds

export function KioskLayout() {
  const navigate = useNavigate()
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
      navigate('/')
    }, IDLE_TIMEOUT_MS)
  }, [isTimerPaused, clearSession, navigate])

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

  return (
    <div className="w-full h-full min-h-screen">
      <Outlet />
    </div>
  )
}
