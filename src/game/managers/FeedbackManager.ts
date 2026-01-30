import { Container, Text, TextStyle } from 'pixi.js'

interface FloatingText extends Text {
  life: number
  maxLife: number
  vy: number
}

export class FeedbackManager extends Container {
  private texts: FloatingText[] = []

  constructor() {
    super()
    // Make sure it renders on top of everything essentially
    this.zIndex = 100
  }

  public spawnFloatingText(text: string, x: number, y: number, color: string | number = '#ffffff') {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: color,
      stroke: { color: '#000000', width: 4 },
      dropShadow: {
        color: '#000000',
        blur: 4,
        angle: Math.PI / 6,
        distance: 2,
      },
    })

    const t = new Text({ text, style }) as FloatingText
    t.anchor.set(0.5)
    t.x = x
    t.y = y
    t.life = 1.5 // 1.5 seconds
    t.maxLife = 1.5
    t.vy = -50 // Move up

    this.addChild(t)
    this.texts.push(t)
  }

  public update(dt: number) {
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i]
      t.life -= dt

      if (t.life <= 0) {
        this.removeChild(t)
        this.texts.splice(i, 1)
        continue
      }

      t.y += t.vy * dt
      t.alpha = t.life / t.maxLife
    }
  }
}
