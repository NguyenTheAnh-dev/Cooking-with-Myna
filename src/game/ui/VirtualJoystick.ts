import { Container, Graphics, FederatedPointerEvent } from 'pixi.js'

export class VirtualJoystick extends Container {
  private outer: Graphics
  private inner: Graphics
  private radius: number = 60
  private dragging: boolean = false
  private data: any = null

  public value: { x: number; y: number } = { x: 0, y: 0 }

  constructor() {
    super()

    this.outer = new Graphics()
    this.outer.circle(0, 0, this.radius)
    this.outer.fill({ color: 0xffffff, alpha: 0.2 })
    this.outer.stroke({ width: 2, color: 0xffffff, alpha: 0.5 })

    this.inner = new Graphics()
    this.inner.circle(0, 0, this.radius / 2)
    this.inner.fill({ color: 0xffffff, alpha: 0.5 })

    this.addChild(this.outer)
    this.addChild(this.inner)

    this.interactive = true
    this.cursor = 'pointer'

    this.on('pointerdown', this.onDragStart)
    this.on('pointerup', this.onDragEnd)
    this.on('pointerupoutside', this.onDragEnd)
    this.on('pointermove', this.onDragMove)
  }

  private onDragStart(event: FederatedPointerEvent) {
    this.data = event
    this.dragging = true
    this.alpha = 1
  }

  private onDragEnd() {
    this.dragging = false
    this.data = null
    this.inner.position.set(0, 0)
    this.value = { x: 0, y: 0 }
    this.alpha = 0.5 // Dim when inactive
  }

  private onDragMove() {
    if (!this.dragging || !this.data) return

    const newPosition = this.data.getLocalPosition(this)

    const dist = Math.sqrt(newPosition.x * newPosition.x + newPosition.y * newPosition.y)
    const maxDist = this.radius

    let x = newPosition.x
    let y = newPosition.y

    if (dist > maxDist) {
      x = (x / dist) * maxDist
      y = (y / dist) * maxDist
    }

    this.inner.position.set(x, y)

    this.value = {
      x: x / maxDist,
      y: y / maxDist,
    }
  }
}
