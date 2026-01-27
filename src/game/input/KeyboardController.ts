import { InputController, InputState } from './InputManager'

export class KeyboardController implements InputController {
  private keys: { [key: string]: boolean } = {}

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true
    })
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
    })
  }

  public update(): void {
    // Passive update
  }

  public getState(): InputState {
    let x = 0
    let y = 0

    if (this.keys['ArrowUp'] || this.keys['KeyW']) y -= 1
    if (this.keys['ArrowDown'] || this.keys['KeyS']) y += 1
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) x -= 1
    if (this.keys['ArrowRight'] || this.keys['KeyD']) x += 1

    return {
      moveX: x,
      moveY: y,
      isInteracting: !!this.keys['Space'] || !!this.keys['KeyF'],
      isPickingUp: !!this.keys['ShiftLeft'] || !!this.keys['KeyE'],
      // Mapping: Space/F for primary interact (Cook/Chop), Shift/E for secondary (Pickup/Drop)?
      // Let's align with game logic.
    }
  }
}
