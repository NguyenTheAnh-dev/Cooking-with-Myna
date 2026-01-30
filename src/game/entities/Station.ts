import { Container, Graphics, Sprite, Texture } from 'pixi.js'
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
    // Map station type to sprite filename
    const spriteMap: Record<StationType, string | null> = {
      stove: 'stove',
      cut: 'cutting_board',
      sink: 'sink',
      plate: 'plate',
      fridge: 'fridge',
      counter: null, // No sprite, use fallback
      serve: null, // No sprite, use fallback
      trash: null, // No sprite, use fallback
      dish_return: null, // No sprite, use fallback
    }

    const spriteName = spriteMap[this.type]

    if (spriteName) {
      // Use sprite
      const texture = Texture.from(`/sprites/stations/${spriteName}.png`)
      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.scale.set(0.5) // Adjust scale as needed
      this.addChild(sprite)
    } else {
      // Fallback to colored rectangle for stations without sprites
      const g = new Graphics()
      let color = 0x95a5a6
      if (this.type === 'serve') color = 0x2ecc71 // Green
      if (this.type === 'trash') color = 0x7f8c8d // Gray
      if (this.type === 'dish_return') color = 0xe67e22 // Orange
      if (this.type === 'counter') color = 0xbdc3c7 // Light gray

      g.rect(-40, -40, 80, 80)
      g.fill(color)
      g.stroke({ width: 2, color: 0x2c3e50 })
      this.addChild(g)
    }

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

    if (this.status === 'burning' || this.progress > 1) {
      // Transition from Green (1) to Red (2)
      color = 0xff0000 // Red alert

      // If we use progress 1->2 for burning phase
      if (this.status === 'completed') {
        // It's technically 'overcooking' but status says completed until fully burnt
        // Let's visualize the overcook phase
        fillPct = this.progress - 1 // 0 to 1 scaling of red bar over green?
        // Actually simpler: Just show Red Bar filling up?
      }
    }

    if (this.status === 'completed') {
      color = 0x00ff00 // Green
      if (this.progress > 1) {
        // Overcooking phase
        color = 0xff4500 // Orange/Red warning
        fillPct = this.progress - 1

        // Draw Green background first?
        this.progressBar.rect(x, y, w, h)
        this.progressBar.fill(0x00ff00)
      } else {
        fillPct = 1
      }
    } else if (this.status === 'burnt') {
      color = 0x555555 // Burnt Gray
      fillPct = 1
    }

    // Fill
    this.progressBar.rect(x, y, w * fillPct, h)
    this.progressBar.fill(color)
  }
}
