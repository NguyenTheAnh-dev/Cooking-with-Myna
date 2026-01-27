export type CharacterState = 'idle' | 'walk' | 'cook' | 'carry'

export type Direction = 'left' | 'right'

export interface Position {
  x: number
  y: number
}

export interface CharacterConfig {
  id: string
  name: string
  startPosition: Position
  speed?: number
  textureId: string // e.g., 'char-boy-1'
}

export interface GameAsset {
  alias: string
  src: string
}
