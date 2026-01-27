import { Container, Text, Graphics } from 'pixi.js'

export class ScoreDisplay extends Container {
  private score: number = 0
  private scoreText: Text
  private background: Graphics
  private targetScore: number = 0 // For smooth animation

  constructor() {
    super()

    // Background
    this.background = new Graphics()
    this.background.roundRect(0, 0, 150, 50, 10)
    this.background.fill({ color: 0x2d2d2d, alpha: 0.9 })
    this.addChild(this.background)

    // Star Icon
    const icon = new Text({
      text: '⭐',
      style: { fontSize: 24 },
    })
    icon.x = 10
    icon.y = 10
    this.addChild(icon)

    // Score Text
    this.scoreText = new Text({
      text: '0',
      style: {
        fontFamily: 'Arial',
        fontSize: 28,
        fontWeight: 'bold',
        fill: 0xffd700,
      },
    })
    this.scoreText.x = 45
    this.scoreText.y = 10
    this.addChild(this.scoreText)
  }

  public addScore(points: number) {
    this.targetScore += points
    this.showScorePopup(points)
  }

  public setScore(points: number) {
    this.score = points
    this.targetScore = points
    this.scoreText.text = this.score.toString()
  }

  public update(_dt: number) {
    // Smooth score counting animation
    if (this.score < this.targetScore) {
      const diff = this.targetScore - this.score
      const increment = Math.max(1, Math.floor(diff * 0.1))
      this.score = Math.min(this.score + increment, this.targetScore)
      this.scoreText.text = this.score.toString()
    }
  }

  private showScorePopup(points: number) {
    const popup = new Text({
      text: `+${points}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        fill: 0x00ff00,
      },
    })
    popup.x = this.width / 2
    popup.y = -10
    popup.anchor.set(0.5)
    this.addChild(popup)

    // Animate popup
    let frame = 0
    const animate = () => {
      frame++
      popup.y -= 2
      popup.alpha -= 0.03

      if (popup.alpha <= 0) {
        this.removeChild(popup)
      } else {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }

  public getScore(): number {
    return this.score
  }
}
