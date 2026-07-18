import { create } from 'zustand'

interface UserSession {
  pioneerId: string
  alias: string
}

interface KioskState {
  session: UserSession | null
  isTimerPaused: boolean
  isProcessingPayment: boolean
  setSession: (session: UserSession | null) => void
  setTimerPaused: (paused: boolean) => void
  setIsProcessingPayment: (isProcessingPayment: boolean) => void
  clearSession: () => void
}

export const useKioskStore = create<KioskState>((set) => ({
  session: null,
  isTimerPaused: false,
  isProcessingPayment: false,
  setSession: (session) => set({ session }),
  setTimerPaused: (isTimerPaused) => set({ isTimerPaused }),
  setIsProcessingPayment: (isProcessingPayment) => set({ isProcessingPayment }),
  clearSession: () => set({ session: null }),
}))
