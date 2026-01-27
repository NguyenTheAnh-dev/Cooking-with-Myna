import { Container, Graphics, FederatedPointerEvent } from 'pixi.js'

export class EditableEntity extends Container {
  public gameEntity: Container
  private highlight: Graphics
  private isDragging: boolean = false
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 }

  // Grid settings
  private gridSize: number = 50

  constructor(originalEntity: Container) {
    super()
    this.gameEntity = originalEntity
    this.addChild(originalEntity) // Wrap it

    // Create Highlight/Hit Area
    this.highlight = new Graphics()
    this.drawHighlight(0x00ff00)
    this.highlight.alpha = 0 // Invisible by default
    this.addChildAt(this.highlight, 0) // Draw behind

    // Interactivity
    this.interactive = true
    this.on('pointerdown', this.onDragStart)
    this.on('pointerup', this.onDragEnd)
    this.on('pointerupoutside', this.onDragEnd)
    this.on('pointermove', this.onDragMove)

    this.cursor = 'pointer'
  }

  public setGridSize(size: number) {
    this.gridSize = size
  }

  private drawHighlight(color: number) {
    this.highlight.clear()
    // Approximate bounds based on children (Station is -40,-40 to 80,80)
    // Usually would use getLocalBounds() but let's hardcode typical station size for now
    this.highlight.rect(-45, -45, 90, 90)
    this.highlight.stroke({ width: 2, color: color })
    this.highlight.fill({ color: color, alpha: 0.2 })
  }

  private onDragStart(event: FederatedPointerEvent) {
    this.isDragging = true
    this.highlight.alpha = 1
    this.dragOffset.x = event.global.x - this.x
    this.dragOffset.y = event.global.y - this.y
    event.stopPropagation()
  }

  private onDragEnd() {
    this.isDragging = false
    this.highlight.alpha = 0

    // Snap on end
    this.snapToGrid()
  }

  private onDragMove(event: FederatedPointerEvent) {
    if (!this.isDragging) return

    // Update position
    const newX = event.global.x - this.dragOffset.x
    const newY = event.global.y - this.dragOffset.y

    this.x = newX
    this.y = newY
  }

  private snapToGrid() {
    this.x = Math.round(this.x / this.gridSize) * this.gridSize
    this.y = Math.round(this.y / this.gridSize) * this.gridSize

    // Sync wrapped entity if needed (since we moved THIS container)
    // We are essentially treating EditableEntity AS the entity in the editor scene
  }

  public getEntityConfig(): any {
    // Helper to extract data for export
    // Assume it's a station for now
    if ('id' in this.gameEntity && 'type' in this.gameEntity) {
      const s = this.gameEntity as any
      return {
        id: s.id,
        type: 'station',
        subtype: s.type,
        x: this.x,
        y: this.y,
      }
    }
    return null
  }
}
