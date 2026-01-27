import { Container, Graphics, Text } from 'pixi.js'
import { EventBus } from '../core/EventBus'

export class PauseMenu extends Container {
  private background: Graphics

  constructor(screenWidth: number = 1200, screenHeight: number = 800) {
    super()
    this.visible = false

    // Dark overlay
    this.background = new Graphics()
    this.background.rect(0, 0, screenWidth, screenHeight)
    this.background.fill({ color: 0x000000, alpha: 0.7 })
    this.addChild(this.background)

    // Pause panel
    const panel = new Graphics()
    panel.roundRect(screenWidth / 2 - 200, screenHeight / 2 - 150, 400, 300, 20)
    panel.fill({ color: 0x2d2d4d })
    panel.stroke({ width: 3, color: 0xffd700 })
    this.addChild(panel)

    // Title
    const title = new Text({
      text: '⏸ PAUSED',
      style: {
        fontFamily: 'Arial',
        fontSize: 36,
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    })
    title.anchor.set(0.5)
    title.x = screenWidth / 2
    title.y = screenHeight / 2 - 100
    this.addChild(title)

    // Buttons
    const buttons = [
      { label: '▶ Resume', action: 'PAUSE_RESUME', y: 0 },
      { label: '🔄 Restart', action: 'PAUSE_RESTART', y: 60 },
      { label: '🚪 Exit', action: 'PAUSE_EXIT', y: 120 },
    ]

    buttons.forEach((btn) => {
      const button = this.createButton(
        btn.label,
        btn.action,
        screenWidth / 2,
        screenHeight / 2 - 20 + btn.y
      )
      this.addChild(button)
    })
  }

  private createButton(label: string, action: string, x: number, y: number): Container {
    const button = new Container()
    button.x = x
    button.y = y

    const bg = new Graphics()
    bg.roundRect(-120, -20, 240, 40, 20)
    bg.fill({ color: 0x4a4a6a })
    button.addChild(bg)

    const text = new Text({
      text: label,
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    })
    text.anchor.set(0.5)
    button.addChild(text)

    button.interactive = true
    button.cursor = 'pointer'

    button.on('pointerover', () => {
      bg.clear()
      bg.roundRect(-120, -20, 240, 40, 20)
      bg.fill({ color: 0x6a6a8a })
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.roundRect(-120, -20, 240, 40, 20)
      bg.fill({ color: 0x4a4a6a })
    })

    button.on('pointerdown', () => {
      EventBus.getInstance().emit(action, {})
    })

    return button
  }

  public show() {
    this.visible = true
  }

  public hide() {
    this.visible = false
  }

  public toggle() {
    this.visible = !this.visible
  }
}
