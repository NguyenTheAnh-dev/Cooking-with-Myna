import { Container, Graphics } from 'pixi.js'
import { Item } from './Item'

export type StationType = 'stove' | 'cut' | 'sink' | 'plate' | 'counter' | 'serve'

export class Station extends Container {
  public id: string
  public type: StationType
  public isOccupied: boolean = false
  public processedItem: Item | null = null // Todo: Type with Item

  constructor(id: string, type: StationType, x: number, y: number) {
    super()
    this.id = id
    this.type = type
    this.x = x
    this.y = y

    this.draw()
  }

  private draw() {
    const g = new Graphics()

    // Color code stations
    let color = 0x95a5a6
    if (this.type === 'stove') color = 0xe74c3c
    if (this.type === 'cut') color = 0xf1c40f
    if (this.type === 'sink') color = 0x3498db
    if (this.type === 'serve') color = 0x2ecc71

    g.rect(-40, -40, 80, 80)
    g.fill(color)
    g.stroke({ width: 2, color: 0x2c3e50 })

    this.addChild(g)
  }
}
