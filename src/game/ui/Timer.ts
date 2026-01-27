import { Container, Text, Graphics } from 'pixi.js'

export class Timer extends Container {
  private timeRemaining: number // milliseconds
  private timerText: Text
  private background: Graphics
  private isRunning: boolean = false
  private onComplete: (() => void) | null = null

  constructor(initialTimeMs: number = 180000) {
    super()
    this.timeRemaining = initialTimeMs

    // Background
    this.background = new Graphics()
    this.background.roundRect(0, 0, 120, 50, 10)
    this.background.fill({ color: 0x2d2d2d, alpha: 0.9 })
    this.addChild(this.background)

    // Timer Icon (clock symbol)
    const icon = new Text({
      text: '⏱',
      style: { fontSize: 24 },
    })
    icon.x = 10
    icon.y = 10
    this.addChild(icon)

    // Timer Text
    this.timerText = new Text({
      text: this.formatTime(this.timeRemaining),
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    })
    this.timerText.x = 45
    this.timerText.y = 12
    this.addChild(this.timerText)
  }

  public start() {
    this.isRunning = true
  }

  public pause() {
    this.isRunning = false
  }

  public reset(timeMs: number) {
    this.timeRemaining = timeMs
    this.updateDisplay()
  }

  public setOnComplete(callback: () => void) {
    this.onComplete = callback
  }

  public update(dt: number) {
    if (!this.isRunning) return

    this.timeRemaining -= dt

    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0
      this.isRunning = false
      this.onComplete?.()
    }

    this.updateDisplay()
  }

  private updateDisplay() {
    this.timerText.text = this.formatTime(this.timeRemaining)

    // Color warning when low time
    if (this.timeRemaining < 30000) {
      this.timerText.style.fill = 0xff4444
    } else if (this.timeRemaining < 60000) {
      this.timerText.style.fill = 0xffaa00
    } else {
      this.timerText.style.fill = 0xffffff
    }
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  public getTimeRemaining(): number {
    return this.timeRemaining
  }
}
