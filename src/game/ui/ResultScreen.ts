import { Container, Graphics, Text } from 'pixi.js'
import { EventBus } from '../core/EventBus'

export class ResultScreen extends Container {
  private background: Graphics
  private scoreText: Text
  private starsContainer: Container

  constructor(screenWidth: number = 1200, screenHeight: number = 800) {
    super()
    this.visible = false

    // Dark overlay
    this.background = new Graphics()
    this.background.rect(0, 0, screenWidth, screenHeight)
    this.background.fill({ color: 0x1a1a2e, alpha: 0.95 })
    this.addChild(this.background)

    // Result panel
    const panel = new Graphics()
    panel.roundRect(screenWidth / 2 - 250, screenHeight / 2 - 200, 500, 400, 20)
    panel.fill({ color: 0x2d2d4d })
    panel.stroke({ width: 3, color: 0xffd700 })
    this.addChild(panel)

    // Title
    const title = new Text({
      text: '🎉 Level Complete!',
      style: {
        fontFamily: 'Arial',
        fontSize: 40,
        fontWeight: 'bold',
        fill: 0xffd700,
      },
    })
    title.anchor.set(0.5)
    title.x = screenWidth / 2
    title.y = screenHeight / 2 - 140
    this.addChild(title)

    // Stars container
    this.starsContainer = new Container()
    this.starsContainer.x = screenWidth / 2
    this.starsContainer.y = screenHeight / 2 - 60
    this.addChild(this.starsContainer)

    // Score
    this.scoreText = new Text({
      text: 'Score: 0',
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    })
    this.scoreText.anchor.set(0.5)
    this.scoreText.x = screenWidth / 2
    this.scoreText.y = screenHeight / 2 + 20
    this.addChild(this.scoreText)

    // Buttons
    const buttons = [
      { label: '🔄 Replay', action: 'RESULT_REPLAY', x: screenWidth / 2 - 100 },
      { label: '▶ Next', action: 'RESULT_NEXT', x: screenWidth / 2 + 100 },
    ]

    buttons.forEach((btn) => {
      const button = this.createButton(btn.label, btn.action, btn.x, screenHeight / 2 + 100)
      this.addChild(button)
    })

    // Menu button
    const menuBtn = this.createButton(
      '🏠 Menu',
      'RESULT_MENU',
      screenWidth / 2,
      screenHeight / 2 + 160
    )
    this.addChild(menuBtn)
  }

  public show(score: number, starRating: number = 3) {
    this.visible = true
    this.scoreText.text = `Score: ${score}`
    this.drawStars(starRating)
  }

  private drawStars(count: number) {
    // Clear existing
    this.starsContainer.removeChildren()

    const starSize = 40
    const spacing = 50
    const totalWidth = 3 * spacing

    for (let i = 0; i < 3; i++) {
      const star = new Text({
        text: i < count ? '⭐' : '☆',
        style: {
          fontSize: starSize,
        },
      })
      star.anchor.set(0.5)
      star.x = (i - 1) * spacing
      this.starsContainer.addChild(star)
    }
  }

  private createButton(label: string, action: string, x: number, y: number): Container {
    const button = new Container()
    button.x = x
    button.y = y

    const bg = new Graphics()
    bg.roundRect(-80, -25, 160, 50, 25)
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
      bg.roundRect(-80, -25, 160, 50, 25)
      bg.fill({ color: 0x6a6a8a })
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.roundRect(-80, -25, 160, 50, 25)
      bg.fill({ color: 0x4a4a6a })
    })

    button.on('pointerdown', () => {
      EventBus.getInstance().emit(action, {})
    })

    return button
  }

  public hide() {
    this.visible = false
  }
}
