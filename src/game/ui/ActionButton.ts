import { Container, Graphics, FederatedPointerEvent, Text, TextStyle } from 'pixi.js'

export class ActionButton extends Container {
  private bg: Graphics
  private isPressed: boolean = false
  public buttonLabel: Text

  constructor(text: string, radius: number = 40, color: number = 0xffaa00) {
    super()

    this.bg = new Graphics()
    this.bg.circle(0, 0, radius)
    this.bg.fill({ color: color, alpha: 0.5 })
    this.bg.stroke({ width: 2, color: 0xffffff })
    this.addChild(this.bg)

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 'white',
      fontWeight: 'bold',
    })
    this.buttonLabel = new Text({ text, style })
    this.buttonLabel.anchor.set(0.5)
    this.addChild(this.buttonLabel)

    this.interactive = true
    this.on('pointerdown', () => this.setPressed(true))
    this.on('pointerup', () => this.setPressed(false))
    this.on('pointerupoutside', () => this.setPressed(false))
  }

  private setPressed(pressed: boolean) {
    this.isPressed = pressed
    this.bg.alpha = pressed ? 0.8 : 0.5
    this.scale.set(pressed ? 0.95 : 1)
  }

  public get pressed(): boolean {
    return this.isPressed
  }
}
