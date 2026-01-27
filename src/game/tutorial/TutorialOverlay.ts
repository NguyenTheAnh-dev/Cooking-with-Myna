import { Container, Graphics, Text, TextStyle } from 'pixi.js'

export class TutorialOverlay extends Container {
  private maskLayer: Graphics
  private highlightLayer: Graphics
  private instructionText: Text

  constructor() {
    super()
    this.label = 'TutorialOverlay'
    this.sortableChildren = true
    this.zIndex = 1000 // Ensure it's on top

    // 1. Full Screen Dark Mask
    this.maskLayer = new Graphics()
    this.maskLayer.rect(0, 0, 2000, 2000) // Large enough to cover screen
    this.maskLayer.fill({ color: 0x000000, alpha: 0.5 })
    this.maskLayer.interactive = true // Block clicks on background
    this.addChild(this.maskLayer)

    // 2. Highlight Spot (Initially hidden)
    this.highlightLayer = new Graphics()
    this.addChild(this.highlightLayer)

    // 3. Text Instruction
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
      stroke: { color: '#000000', width: 4, join: 'round' },
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 600,
    })
    this.instructionText = new Text({ text: '', style })
    this.instructionText.anchor.set(0.5, 0)
    this.instructionText.x = 600 // Center of screen assumption
    this.instructionText.y = 100
    this.addChild(this.instructionText)

    this.visible = false
  }

  public show(message: string) {
    this.visible = true
    this.instructionText.text = message
    this.maskLayer.alpha = 0.5
    this.highlightLayer.clear()
  }

  public hide() {
    this.visible = false
  }

  public highlightArea(x: number, y: number, width: number, height: number) {
    // Cut out a hole in any existing mask or just draw a localized highlight
    // A simple way is to draw a clear rect on the mask logic, but PIXI Graphics masks are additive.
    // Easier approach for prototype: Draw a hollow rectangle or focus ring

    this.highlightLayer.clear()
    this.highlightLayer.rect(x - 5, y - 5, width + 10, height + 10)
    this.highlightLayer.stroke({ width: 4, color: 0xffff00 }) // Yellow border

    // Optional: Connecting line or arrow
  }
}
