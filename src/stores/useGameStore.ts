import { create } from 'zustand'
import { Order } from '@/game/systems/OrderManager'

interface GameState {
  score: number
  timeLeft: number // milliseconds
  orders: Order[]
  isGameOver: boolean

  // Actions
  setScore: (score: number) => void
  addScore: (points: number) => void
  setTime: (timeMs: number) => void
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  removeOrder: (orderId: string) => void
  setGameOver: (isOver: boolean) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  timeLeft: 0,
  orders: [],
  isGameOver: false,

  setScore: (score) => set({ score }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setTime: (timeMs) => set({ timeLeft: timeMs }),
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== orderId),
    })),
  setGameOver: (isOver) => set({ isGameOver: isOver }),
  resetGame: () =>
    set({
      score: 0,
      timeLeft: 0, // Or initial time if managed here
      orders: [],
      isGameOver: false,
    }),
}))
