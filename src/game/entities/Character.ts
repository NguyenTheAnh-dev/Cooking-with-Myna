import { Container, Sprite, Texture } from 'pixi.js'
import { CharacterState, Direction } from '../models/GameState'
import { Item } from './Item'

export class Character extends Container {
  public id: string
  public sprite: Sprite

  // Data for Systems
  public state: CharacterState = 'idle'
  public velocity: { x: number; y: number } = { x: 0, y: 0 }
  public speed: number
  public direction: Direction = 'right'
  public holdingItem: Item | null = null

  // Target for pathfinding
  public targetPosition: { x: number; y: number } | null = null

  // Network interpolation targets
  public targetX?: number
  public targetY?: number

  private readonly CHARACTER_SCALE = 0.5

  constructor(id: string, speed: number = 200) {
    // Speed in px/sec
    super()
    this.id = id
    this.speed = speed

    // Load texture
    const texture = Texture.from('/assets/characters/char-girl-1.png')
    this.sprite = new Sprite(texture)
    this.sprite.anchor.set(0.5)
    this.sprite.scale.set(0.5) // Adjust scale as needed for the new assets, 1)
    this.sprite.scale.set(this.CHARACTER_SCALE)

    this.addChild(this.sprite)
  }

  public setVisualState(newState: CharacterState) {
    if (this.state === newState) return
    this.state = newState

    // Visual tinting for prototype
    this.sprite.tint = 0xffffff
    if (newState === 'cook') this.sprite.tint = 0xffa500
    if (newState === 'carry') this.sprite.tint = 0x00ff00
  }

  public setDirection(dir: Direction) {
    this.direction = dir
    this.sprite.scale.x = dir === 'left' ? -this.CHARACTER_SCALE : this.CHARACTER_SCALE
  }
  public playAnimation(anim: string) {
    // Placeholder for animation logic
    // In real implementation, this would switch textures or play AnimatedSprite
    if (anim === 'walk') {
      // simple bobbing
      this.sprite.y = -Math.abs(Math.sin(Date.now() / 100)) * 5
    } else {
      this.sprite.y = 0
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_dt: number) {
    // Base update logic
  }
}
