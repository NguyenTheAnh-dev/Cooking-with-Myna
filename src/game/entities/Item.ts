import { Container, Graphics } from 'pixi.js'

export type ItemType = 'tomato' | 'steak' | 'salad' | 'burger'

export type CookingState = 'raw' | 'chopped' | 'cooked' | 'burnt' | 'plated'

export class Item extends Container {
  public id: string
  public type: ItemType
  public state: CookingState = 'raw'
  public heldBy: string | null = null // Character ID

  constructor(id: string, type: ItemType) {
    super()
    this.id = id
    this.type = type

    this.draw()
  }

  public setState(newState: CookingState) {
    this.state = newState
    this.draw()
  }

  private draw() {
    this.removeChildren()
    const g = new Graphics()

    // Simple shape rep
    g.circle(0, 0, 15)

    if (this.type === 'tomato') g.fill(0xff6347)
    if (this.type === 'steak') g.fill(0x8b4513)
    if (this.type === 'salad') g.fill(0x2ecc71)

    // Status indicator
    if (this.state === 'cooked') g.stroke({ width: 2, color: 0xffd700 })
    if (this.state === 'burnt') g.fill(0x000000)

    this.addChild(g)
  }
}
