import { create } from 'zustand'

export type GamePhase = 'idle' | 'lobby' | 'playing' | 'result'

interface GamePhaseState {
  phase: GamePhase
  setPhase: (phase: GamePhase) => void
}

export const useGamePhaseStore = create<GamePhaseState>((set) => ({
  phase: 'idle',
  setPhase: (phase) => set({ phase }),
}))
