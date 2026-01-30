import { create } from 'zustand'

interface AppState {
  appReady: boolean
  setAppReady: (status: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  appReady: false,
  setAppReady: (status) => set({ appReady: status }),
}))
