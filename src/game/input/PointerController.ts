import { Container, FederatedPointerEvent } from 'pixi.js'
import { CharacterManager } from '../managers/CharacterManager'
import { InputController, InputState } from './InputManager'

export class PointerController implements InputController {
  private characterManager: CharacterManager
  private localPlayerId: string

  // Interactive background
  private hitArea: Container

  constructor(hitArea: Container, characterManager: CharacterManager, localPlayerId: string) {
    this.hitArea = hitArea
    this.characterManager = characterManager
    this.localPlayerId = localPlayerId

    this.setupListeners()
  }

  private setupListeners() {
    this.hitArea.eventMode = 'static'
    this.hitArea.on('pointerdown', this.onPointerDown.bind(this))
  }

  private onPointerDown(e: FederatedPointerEvent) {
    const localPos = this.hitArea.toLocal(e.global)
    const char = this.characterManager.getCharacter(this.localPlayerId)

    if (char) {
      // Set target position for movement system
      char.targetPosition = { x: localPos.x, y: localPos.y }

      // Clear any existing velocity/input movement to rely on target
      char.velocity = { x: 0, y: 0 }
    }
  }

  public update() {
    // No continuous polling needed for tap-to-move
  }

  public getState(): InputState {
    return {
      moveX: 0,
      moveY: 0,
      isInteracting: false,
      isPickingUp: false,
    }
  }
}
