export interface PlayerState {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  anim: string // current animation state
  flipX: boolean
  timestamp: number
}

export interface NetworkEvent {
  type: 'player_state' | 'player_action'
  payload: unknown
}

export interface PlayerActionPayload {
  id: string
  action: string // 'chop', 'wash', etc.
  targetId?: string // station id, item id
}
