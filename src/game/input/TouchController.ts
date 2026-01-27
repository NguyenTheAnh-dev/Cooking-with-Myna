import { InputController, InputState } from '../input/InputManager'
import { VirtualJoystick } from '../ui/VirtualJoystick'
import { ActionButton } from '../ui/ActionButton'

export class TouchController implements InputController {
  private joystick: VirtualJoystick
  private btnInteract: ActionButton
  private btnPickup: ActionButton

  constructor(joystick: VirtualJoystick, btnInteract: ActionButton, btnPickup: ActionButton) {
    this.joystick = joystick
    this.btnInteract = btnInteract
    this.btnPickup = btnPickup
  }

  public update(): void {
    // UI updates itself via Pixi events
  }

  public getState(): InputState {
    return {
      moveX: this.joystick.value.x,
      moveY: this.joystick.value.y,
      isInteracting: this.btnInteract.pressed,
      isPickingUp: this.btnPickup.pressed,
    }
  }
}
