import { Container } from 'pixi.js'
import { VirtualJoystick } from './VirtualJoystick'
import { ActionButton } from './ActionButton'
import { InputManager } from '../input/InputManager'
import { TouchController } from '../input/TouchController'

export class MobileHUD extends Container {
  private joystick: VirtualJoystick
  private btnInteract: ActionButton
  private btnPickup: ActionButton

  constructor() {
    super()

    // 1. Joystick (Bottom Left)
    this.joystick = new VirtualJoystick()
    this.joystick.position.set(120, 680) // Assuming 1200x800 logic dimensions
    this.addChild(this.joystick)

    // 2. Buttons (Bottom Right)
    this.btnInteract = new ActionButton('F', 45, 0xff0000) // Interact (Red)
    this.btnInteract.position.set(1080, 680)
    this.addChild(this.btnInteract)

    this.btnPickup = new ActionButton('E', 35, 0x0000ff) // Pickup (Blue)
    this.btnPickup.position.set(980, 720)
    this.addChild(this.btnPickup)

    // 3. Register Controller
    const controller = new TouchController(this.joystick, this.btnInteract, this.btnPickup)
    InputManager.getInstance().addController(controller)
  }
}
