import { Container, Graphics, Text } from 'pixi.js'
import { EventBus } from '../core/EventBus'

interface MenuButton {
  label: string
  action: string
}

export class MainMenu extends Container {
  private background: Graphics
  private buttons: Container[] = []

  constructor(screenWidth: number = 1200, screenHeight: number = 800) {
    super()

    // Full screen dark overlay
    this.background = new Graphics()
    this.background.rect(0, 0, screenWidth, screenHeight)
    this.background.fill({ color: 0x1a1a2e, alpha: 0.95 })
    this.addChild(this.background)

    // Title
    const title = new Text({
      text: '🍳 Cook with Myna',
      style: {
        fontFamily: 'Arial',
        fontSize: 64,
        fontWeight: 'bold',
        fill: 0xffd700,
      },
    })
    title.anchor.set(0.5)
    title.x = screenWidth / 2
    title.y = 150
    this.addChild(title)

    // Subtitle
    const subtitle = new Text({
      text: 'A Cooperative Cooking Game',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xaaaaaa,
      },
    })
    subtitle.anchor.set(0.5)
    subtitle.x = screenWidth / 2
    subtitle.y = 220
    this.addChild(subtitle)

    // Menu buttons
    const menuButtons: MenuButton[] = [
      { label: '▶ Play Solo', action: 'MENU_PLAY_SOLO' },
      { label: '👥 Multiplayer', action: 'MENU_MULTIPLAYER' },
      { label: '📖 Tutorial', action: 'MENU_TUTORIAL' },
      { label: '⚙ Settings', action: 'MENU_SETTINGS' },
    ]

    menuButtons.forEach((btn, index) => {
      const button = this.createButton(btn.label, btn.action, screenWidth / 2, 320 + index * 70)
      this.buttons.push(button)
      this.addChild(button)
    })
  }

  private createButton(label: string, action: string, x: number, y: number): Container {
    const button = new Container()
    button.x = x
    button.y = y

    // Background
    const bg = new Graphics()
    bg.roundRect(-150, -25, 300, 50, 25)
    bg.fill({ color: 0x4a4a6a })
    bg.stroke({ width: 2, color: 0x6a6a8a })
    button.addChild(bg)

    // Label
    const text = new Text({
      text: label,
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    })
    text.anchor.set(0.5)
    button.addChild(text)

    // Interactivity
    button.interactive = true
    button.cursor = 'pointer'

    button.on('pointerover', () => {
      bg.clear()
      bg.roundRect(-150, -25, 300, 50, 25)
      bg.fill({ color: 0x6a6a8a })
      bg.stroke({ width: 2, color: 0xffd700 })
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.roundRect(-150, -25, 300, 50, 25)
      bg.fill({ color: 0x4a4a6a })
      bg.stroke({ width: 2, color: 0x6a6a8a })
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
}
