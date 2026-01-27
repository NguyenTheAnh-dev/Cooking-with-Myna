import { EventBus } from '../core/EventBus'

export interface InputState {
  moveX: number
  moveY: number
  isInteracting: boolean
  isPickingUp: boolean
}

export interface InputController {
  update(): void
  getState(): InputState
}

export class InputManager {
  private static instance: InputManager
  private controllers: InputController[] = []

  // Consolidated state
  private currentState: InputState = {
    moveX: 0,
    moveY: 0,
    isInteracting: false,
    isPickingUp: false,
  }

  private constructor() {}

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager()
    }
    return InputManager.instance
  }

  public addController(controller: InputController) {
    this.controllers.push(controller)
  }

  public update() {
    // Reset state before aggregation
    let moveX = 0
    let moveY = 0
    let interact = false
    let pickup = false

    // Aggregate inputs from all controllers
    for (const controller of this.controllers) {
      controller.update()
      const state = controller.getState()

      // Add vectors (clamped later)
      moveX += state.moveX
      moveY += state.moveY

      // OR logic for buttons
      if (state.isInteracting) interact = true
      if (state.isPickingUp) pickup = true
    }

    // Normalize movement vector if needed to prevent faster diagonal movement
    const len = Math.sqrt(moveX * moveX + moveY * moveY)
    if (len > 1) {
      moveX /= len
      moveY /= len
    }

    this.currentState = { moveX, moveY, isInteracting: interact, isPickingUp: pickup }

    // In a real game, we might emit only on change or every frame.
    // For direct driving of character, we often pull state in Update loop.
    // However, existing system relies on 'PLAYER_MOVE' events.
    // So let's emit that.

    // Emit Move Event if moving
    if (Math.abs(moveX) > 0.01 || Math.abs(moveY) > 0.01) {
      // We need to know WHICH player is local.
      // For now, let's assume Player 1 is the local player controlled by inputs.
      // In strict multiplayer, inputs would drive a specific ID.
      EventBus.getInstance().emit('INPUT_MOVE', {
        x: moveX,
        y: moveY,
        isInteracting: interact, // Pass buttons too or separate?
        isPickingUp: pickup,
      })
    }

    // Edge trigger for actions?
    // Implementing edge detection typically belongs in specific controllers or here.
    // Let's assume actions are continuous or handled by receiver for now,
    // but usually Interact is "On Press".
  }

  public getState(): InputState {
    return this.currentState
  }
}
