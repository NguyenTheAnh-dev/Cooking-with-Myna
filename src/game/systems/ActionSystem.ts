import { EventBus } from '../core/EventBus'
import { CharacterManager } from '../managers/CharacterManager'
import { DishManager } from '../managers/DishManager'
import { Plate } from '../entities/Plate'
import { Station, StationType } from '../entities/Station'

interface InputMovePayload {
  x: number
  y: number
}

interface MovePayload {
  characterId: string
  x: number
  y: number
}

interface InteractPayload {
  characterId: string
  stationId?: string
}

export class ActionSystem {
  private characterManager: CharacterManager | null = null
  private dishManager: DishManager | null = null
  private stations: Map<string, Station> = new Map()
  private filter: ((payload: MovePayload) => boolean) | null = null

  // Track washing state per character
  private washingState: Map<string, { plate: Plate; station: Station }> = new Map()

  constructor() {
    const eventBus = EventBus.getInstance()
    eventBus.on('PLAYER_MOVE', (p) => this.handleMove(p))
    eventBus.on('INPUT_MOVE', (p) => this.handleInputMove(p as InputMovePayload))
    eventBus.on('INPUT_INTERACT', (p) => this.handleInteract(p as InteractPayload))
    eventBus.on('INPUT_INTERACT_RELEASE', (p) => this.handleInteractRelease(p as InteractPayload))
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

  public setDishManager(manager: DishManager) {
    this.dishManager = manager
  }

  public addStation(station: Station) {
    this.stations.set(station.id, station)
  }

  public setFilter(filter: (payload: MovePayload) => boolean) {
    this.filter = filter
  }

  public clearFilter() {
    this.filter = null
  }

  public update(dt: number) {
    // Update washing progress for all characters currently washing
    for (const [charId, washData] of this.washingState.entries()) {
      const isComplete = washData.plate.updateWashing(dt)
      if (isComplete) {
        // Washing complete
        this.washingState.delete(charId)
        EventBus.getInstance().emit('DISH_WASHED', {
          characterId: charId,
          plateId: washData.plate.id,
        })
        console.log(`[ActionSystem] Dish washed by ${charId}`)

        // Return clean plate to dish manager
        if (this.dishManager) {
          this.dishManager.returnCleanPlate(washData.plate)
        }
      }
    }
  }

  /**
   * Handle interact button press
   */
  private handleInteract(payload: InteractPayload) {
    const char = this.characterManager?.getCharacter(payload.characterId)
    if (!char) return

    // Find nearest station
    const nearestStation = this.findNearestStation(char.x, char.y, 80)
    if (!nearestStation) return

    console.log(`[ActionSystem] Interact with ${nearestStation.type} station`)

    switch (nearestStation.type) {
      case 'sink':
        this.handleSinkInteract(payload.characterId, nearestStation)
        break
      case 'dish_return':
        this.handleDishReturnInteract(payload.characterId, nearestStation)
        break
      case 'plate':
        this.handlePlateStationInteract(payload.characterId, nearestStation)
        break
      default:
        // Other station interactions handled elsewhere
        EventBus.getInstance().emit('STATION_INTERACT', {
          characterId: payload.characterId,
          stationId: nearestStation.id,
          stationType: nearestStation.type,
        })
    }
  }

  /**
   * Handle interact button release (for hold actions like washing)
   */
  private handleInteractRelease(payload: InteractPayload) {
    const washData = this.washingState.get(payload.characterId)
    if (washData) {
      // Cancel washing if released early
      washData.plate.cancelWashing()
      this.washingState.delete(payload.characterId)
      console.log(`[ActionSystem] Washing cancelled by ${payload.characterId}`)
    }
  }

  private handleSinkInteract(characterId: string, station: Station) {
    const char = this.characterManager?.getCharacter(characterId)
    if (!char) return

    // Check if character is holding a dirty plate (via holdingItem which could be a Plate)
    // For simplicity, check if there are dirty plates and character is at sink
    if (this.dishManager && this.dishManager.getDirtyPlateCount() > 0) {
      const dirtyPlate = this.dishManager.pickupDirtyPlate()
      if (dirtyPlate) {
        dirtyPlate.startWashing()
        this.washingState.set(characterId, { plate: dirtyPlate, station })

        // Position plate at sink
        dirtyPlate.x = station.x
        dirtyPlate.y = station.y - 20

        EventBus.getInstance().emit('WASHING_STARTED', {
          characterId,
          plateId: dirtyPlate.id,
        })
        console.log(`[ActionSystem] Started washing dish at sink`)
      }
    }
  }

  private handleDishReturnInteract(characterId: string, _station: Station) {
    // Pick up dirty dish from return point
    if (this.dishManager) {
      const dirtyPlate = this.dishManager.pickupDirtyPlate()
      if (dirtyPlate) {
        // Character now holding dirty plate
        EventBus.getInstance().emit('PLATE_PICKED_UP', {
          characterId,
          plateId: dirtyPlate.id,
          state: 'dirty',
        })
        console.log(`[ActionSystem] Picked up dirty plate from return point`)
      }
    }
  }

  private handlePlateStationInteract(characterId: string, _station: Station) {
    // Get clean plate from plate station
    if (this.dishManager && this.dishManager.hasCleanPlates()) {
      const cleanPlate = this.dishManager.getCleanPlate()
      if (cleanPlate) {
        EventBus.getInstance().emit('PLATE_PICKED_UP', {
          characterId,
          plateId: cleanPlate.id,
          state: 'clean',
        })
        console.log(`[ActionSystem] Picked up clean plate`)
      }
    } else {
      console.log(`[ActionSystem] No clean plates available!`)
      EventBus.getInstance().emit('NO_CLEAN_PLATES', { characterId })
    }
  }

  private findNearestStation(x: number, y: number, maxDistance: number): Station | null {
    let nearest: Station | null = null
    let nearestDist = maxDistance

    for (const station of this.stations.values()) {
      const dx = station.x - x
      const dy = station.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < nearestDist) {
        nearestDist = dist
        nearest = station
      }
    }

    return nearest
  }

  private handleMove(payload: unknown) {
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
