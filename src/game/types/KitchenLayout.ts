export interface EntityConfig {
  id: string
  type: 'station' | 'wall' | 'obstacle' | 'spawn_point'
  subtype?: string // e.g., 'stove', 'cut', 'sink', 'plate', 'serve'
  x: number
  y: number
  width?: number
  height?: number
  rotation?: number
}

export interface KitchenLayout {
  id: string
  name: string
  width: number
  height: number
  entities: EntityConfig[]
}
