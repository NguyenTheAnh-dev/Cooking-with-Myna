import { Container, Graphics, Sprite, Assets } from 'pixi.js'

export type PlateState = 'clean' | 'dirty' | 'washing'

export class Plate extends Container {
  public id: string
  public state: PlateState = 'clean'
  public heldBy: string | null = null // Character ID holding this plate

  private graphic: Graphics
  private washProgress: number = 0
  private readonly WASH_TIME = 2000 // 2 seconds to wash

  constructor(id: string, state: PlateState = 'clean') {
    super()
    this.id = id
    this.state = state
    this.graphic = new Graphics()
    this.addChild(this.graphic)
    this.draw()
  }

  public setState(newState: PlateState) {
    this.state = newState
    this.washProgress = 0
    this.draw()
  }

  public startWashing(): void {
    if (this.state === 'dirty') {
      this.state = 'washing'
      this.washProgress = 0
    }
  }

  /**
   * Update washing progress
   * @returns true when washing is complete
   */
  public updateWashing(dt: number): boolean {
    if (this.state !== 'washing') return false

    this.washProgress += dt
    this.draw() // Update progress visual

    if (this.washProgress >= this.WASH_TIME) {
      this.setState('clean')
      return true
    }
    return false
  }

  public getWashProgress(): number {
    return Math.min(this.washProgress / this.WASH_TIME, 1)
  }

  public cancelWashing(): void {
    if (this.state === 'washing') {
      this.state = 'dirty'
      this.washProgress = 0
      this.draw()
    }
  }

  private draw() {
    this.graphic.clear()

    // Plate base
    const radius = 20
    this.graphic.circle(0, 0, radius)

    // Color based on state
    switch (this.state) {
      case 'clean':
        this.graphic.fill(0xffffff) // White clean plate
        this.graphic.stroke({ width: 2, color: 0xcccccc })
        break
      case 'dirty':
        this.graphic.fill(0x8b7355) // Brown dirty plate
        this.graphic.stroke({ width: 2, color: 0x654321 })
        // Add "mess" circles
        this.graphic.circle(-5, -3, 4)
        this.graphic.circle(6, 2, 3)
        this.graphic.fill(0x5d4e37)
        break
      case 'washing':
        // Show progress ring
        this.graphic.fill(0xa0c4e8) // Blue-ish washing
        this.graphic.stroke({ width: 2, color: 0x3498db })
        // Progress arc
        const progress = this.getWashProgress()
        if (progress > 0) {
          this.graphic.arc(0, 0, radius + 3, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2)
          this.graphic.stroke({ width: 3, color: 0x2ecc71 })
        }
        break
    }
  }
}
