import { create } from 'zustand'

// Placeholder Player interface - extend as needed
export interface Player {
  id: string
  name: string
  isReady: boolean
}

interface RoomState {
  roomId?: string
  players: Player[]
  setRoomId: (id: string) => void
  setPlayers: (players: Player[]) => void
  resetRoom: () => void
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: undefined,
  players: [],
  setRoomId: (id) => set({ roomId: id }),
  setPlayers: (players) => set({ players }),
  resetRoom: () => set({ roomId: undefined, players: [] }),
}))
