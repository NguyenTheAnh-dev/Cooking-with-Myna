import { EventBus } from '../core/EventBus'
import { CharacterManager } from '../managers/CharacterManager'

interface InputMovePayload {
  x: number
  y: number
}

interface MovePayload {
  characterId: string
  x: number
  y: number
}

export class ActionSystem {
  private characterManager: CharacterManager | null = null
  private filter: ((payload: MovePayload) => boolean) | null = null

  constructor() {
    const eventBus = EventBus.getInstance()
    eventBus.on('PLAYER_MOVE', (p) => this.handleMove(p))
    eventBus.on('INPUT_MOVE', (p) => this.handleInputMove(p as InputMovePayload))
  }

  private handleInputMove(payload: InputMovePayload) {
    const localId = 'player-1'
    const { x, y } = payload

    const char = this.characterManager?.getCharacter(localId)
    if (char) {
      char.velocity = { x: x * char.speed, y: y * char.speed }

      if (x !== 0 || y !== 0) {
        char.targetPosition = null
      }
    }
  }

  public setManager(manager: CharacterManager) {
    this.characterManager = manager
  }

  public setFilter(filter: (payload: MovePayload) => boolean) {
    this.filter = filter
  }

  public clearFilter() {
    this.filter = null
  }

  public update(_dt: number) {
    // Check for held keys if implementing keyboard directly
  }

  private handleMove(payload: unknown) {
    // Payload: { characterId, x, y }
    if (!this.characterManager) return

    const movePayload = payload as MovePayload
    if (this.filter && !this.filter(movePayload)) {
      return
    }

    const char = this.characterManager.getCharacter(movePayload.characterId)
    if (char) {
      char.targetPosition = { x: movePayload.x, y: movePayload.y }
    }
  }
}
