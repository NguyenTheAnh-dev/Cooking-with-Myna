import { create } from 'zustand'

interface GameStore {
  score: number
  timeLeft: number
  isConnected: boolean
  players: string[]
  setScore: (score: number) => void
  addPlayer: (id: string) => void
  removePlayer: (id: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  timeLeft: 300,
  isConnected: false,
  players: [],
  setScore: (score) => set({ score }),
  addPlayer: (id) => set((state) => ({ players: [...state.players, id] })),
  removePlayer: (id) => set((state) => ({ players: state.players.filter((p) => p !== id) })),
}))
