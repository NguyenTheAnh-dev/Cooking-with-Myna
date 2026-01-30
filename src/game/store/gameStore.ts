import { create } from 'zustand'
import { Order } from '../systems/OrderManager'

interface GameStore {
  score: number
  timeLeft: number
  isGameOver: boolean
  isConnected: boolean
  players: string[]
  orders: Order[]
  setScore: (score: number) => void
  setTime: (time: number) => void
  setGameOver: (isOver: boolean) => void
  addPlayer: (id: string) => void
  removePlayer: (id: string) => void
  addOrder: (order: Order) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  timeLeft: 300,
  isGameOver: false,
  isConnected: false,
  players: [],
  orders: [],
  setScore: (score) => set({ score }),
  setTime: (timeLeft) => set({ timeLeft }),
  setGameOver: (isGameOver) => set({ isGameOver }),
  addPlayer: (id) => set((state) => ({ players: [...state.players, id] })),
  removePlayer: (id) => set((state) => ({ players: state.players.filter((p) => p !== id) })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  resetGame: () => set({ score: 0, timeLeft: 180, isGameOver: false, orders: [] }),
}))
