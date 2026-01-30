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

  constructor(id: string, speed: number = 200, textureId: string = 'char-girl-1') {
    // Speed in px/sec
    super()
    this.id = id
    this.speed = speed

    // Load texture based on provided textureId
    const texture = Texture.from(`/characters/${textureId}.png`)
    this.sprite = new Sprite(texture)
    this.sprite.anchor.set(0.5)
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
  public update(dt: number) {
    // Determine if moving
    const isMoving = Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1

    if (isMoving) {
      // Waddle Effect
      const wobbleSpeed = 15
      const wobbleAmount = 0.1
      const time = Date.now() / 1000

      // Wobble rotation
      this.sprite.rotation = Math.sin(time * wobbleSpeed) * wobbleAmount

      // Bobbing Y
      // this.sprite.y = -Math.abs(Math.sin(time * wobbleSpeed)) * 5
    } else {
      // Return to neutral
      this.sprite.rotation = 0
      // this.sprite.y = 0
    }

    // Action Animation
    if (this.state === 'chop') {
      const chopSpeed = 20
      const time = Date.now() / 1000
      // Chop motion (scale Y squish)
      // this.sprite.scale.y = this.CHARACTER_SCALE * (1 + Math.sin(time * chopSpeed) * 0.1)
      this.sprite.rotation = Math.sin(time * chopSpeed) * 0.2 // Agressive wobble
    } else if (this.state !== 'carry') {
      // Reset if not carrying (carrying might have its own static pose)
    }
  }
}
