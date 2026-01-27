export type GameEventType =
  | 'PLAYER_JOINED'
  | 'PLAYER_LEFT'
  | 'PLAYER_MOVE'
  | 'PLAYER_ACTION_START'
  | 'PLAYER_ACTION_END'
  | 'GAME_STATE_UPDATE'

export interface GameEvent {
  type: GameEventType
  payload: unknown
  timestamp: number
  senderId: string
}

export interface PlayerMovePayload {
  x: number
  y: number
  direction: 'left' | 'right'
  state: string
}
