import { create } from 'zustand'

interface UserSession {
  pioneerId: string
  alias: string
}

interface KioskState {
  session: UserSession | null
  isTimerPaused: boolean
  setSession: (session: UserSession | null) => void
  setTimerPaused: (paused: boolean) => void
  clearSession: () => void
}

export const useKioskStore = create<KioskState>((set) => ({
  session: null,
  isTimerPaused: false,
  setSession: (session) => set({ session }),
  setTimerPaused: (isTimerPaused) => set({ isTimerPaused }),
  clearSession: () => set({ session: null }),
}))
