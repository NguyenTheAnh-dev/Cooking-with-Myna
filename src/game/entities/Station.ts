import { Container, Graphics } from 'pixi.js'
import { Item } from './Item'

export type StationType =
  | 'stove'
  | 'cut'
  | 'sink'
  | 'plate'
  | 'counter'
  | 'serve'
  | 'fridge'
  | 'trash'
  | 'dish_return'

export class Station extends Container {
  public id: string
  public type: StationType
  public isOccupied: boolean = false
  public processedItem: Item | null = null

  // Cooking State
  public progress: number = 0
  public status: 'idle' | 'cooking' | 'completed' | 'burning' | 'burnt' = 'idle'
  public burnDuration: number = 5 // Default burn duration

  // Visuals
  private progressBar: Graphics | null = null

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
    if (this.type === 'stove') color = 0xe74c3c // Red
    if (this.type === 'cut') color = 0xf1c40f // Yellow
    if (this.type === 'sink') color = 0x3498db // Blue
    if (this.type === 'serve') color = 0x2ecc71 // Green
    if (this.type === 'fridge') color = 0x9b59b6 // Purple-ish
    if (this.type === 'trash') color = 0x7f8c8d // Gray
    if (this.type === 'dish_return') color = 0xe67e22 // Orange
    if (this.type === 'plate') color = 0xecf0f1 // Light gray

    g.rect(-40, -40, 80, 80)
    g.fill(color)
    g.stroke({ width: 2, color: 0x2c3e50 })

    this.addChild(g)

    // Init progress bar container
    this.progressBar = new Graphics()
    this.addChild(this.progressBar)
  }

  public updateProgressBar() {
    if (!this.progressBar) return
    this.progressBar.clear()

    if (this.status === 'idle') return

    // Bar Dimensions
    const w = 60
    const h = 10
    const x = -30
    const y = -50

    // Background
    this.progressBar.rect(x, y, w, h)
    this.progressBar.fill(0x000000)

    // Foreground Color
    let color = 0x00ff00 // Green
    let fillPct = this.progress

    if (this.status === 'burning') {
      color = 0xff0000 // Red alert
      // Maybe pulse or shake?
    } else if (this.status === 'completed') {
      color = 0x00ff00 // Solid Green
      fillPct = 1
    } else if (this.status === 'burnt') {
      color = 0x555555 // Burnt Gray
      fillPct = 1
    }

    // Fill
    this.progressBar.rect(x, y, w * fillPct, h)
    this.progressBar.fill(color)
  }
}
