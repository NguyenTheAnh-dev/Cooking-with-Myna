import { EventBus } from '../core/EventBus'
import { CharacterManager } from '../managers/CharacterManager'

export class ActionSystem {
  private characterManager: CharacterManager | null = null

  constructor() {
    const eventBus = EventBus.getInstance()
    eventBus.on('PLAYER_MOVE', this.handleMove.bind(this))
  }

  private filter: ((payload: any) => boolean) | null = null

  public setManager(manager: CharacterManager) {
    this.characterManager = manager
  }

  public setFilter(filter: (payload: any) => boolean) {
    this.filter = filter
  }

  public clearFilter() {
    this.filter = null
  }

  public update(_dt: number) {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    // Check for held keys if implementing keyboard directly
  }

  private handleMove(payload: unknown) {
    // Payload: { characterId, x, y }
    if (!this.characterManager) return
    if (this.filter && !this.filter(payload)) {
      // console.log("Action blocked by tutorial filter")
      return
    }

    const movePayload = payload as { characterId: string; x: number; y: number }
    const char = this.characterManager.getCharacter(movePayload.characterId)
    if (char) {
      char.targetPosition = { x: movePayload.x, y: movePayload.y }
    }
  }
}
