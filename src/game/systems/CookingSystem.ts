import { RecipeSystem } from './RecipeSystem'
import { Station } from '../entities/Station'
import { EventBus } from '../core/EventBus'

export class CookingSystem {
  private stations: Station[] = []

  public setStations(stations: Station[]) {
    this.stations = stations
  }

  public update(dt: number) {
    this.stations.forEach((station) => {
      this.processStation(station, dt)
      station.updateProgressBar()
    })
  }

  private processStation(station: Station, dt: number) {
    if (!station.isOccupied || !station.processedItem) {
      station.status = 'idle'
      station.progress = 0
      return
    }

    // 1. COOKING STATE
    if (station.status === 'cooking') {
      const currentItem = station.processedItem

      let step = null
      for (const [, recipe] of RecipeSystem.getAllRecipes()) {
        const found = recipe.steps.find(
          (s) =>
            s.requiredItem === currentItem.type &&
            s.requiredState === currentItem.state &&
            s.station === station.type &&
            s.action === 'cook'
        )
        if (found) {
          step = found
          break
        }
      }

      if (!step) return

      const duration = step.duration || 3

      // Increase progress
      station.progress += dt / duration

      if (station.progress >= 1) {
        // Cooking Complete
        station.progress = 1
        station.status = 'completed'

        // Update Item State
        currentItem.state = step.nextState
        // Visual update could happen here (change sprite to cooked)
        EventBus.getInstance().emit('COOKING_COMPLETED', {
          stationId: station.id,
          item: currentItem,
        })

        // Store burn config for the next phase
        station.burnDuration = step.burnDuration || 5
      }
    }

    // 2. BURNING STATE (Overcooked)
    else if (station.status === 'completed' || station.status === 'burning') {
      // Only Stove burns food usually
      if (station.type !== 'stove') return

      // Initialize burning
      if (station.status === 'completed') {
        station.status = 'burning'
        station.progress = 0
      }

      const burnTime = station.burnDuration

      if (station.status === 'burning') {
        station.progress += dt / burnTime

        if (station.progress >= 1) {
          station.status = 'burnt'
          station.progress = 1
          station.processedItem!.state = 'burnt'
          EventBus.getInstance().emit('ITEM_BURNT', {
            stationId: station.id,
            item: station.processedItem,
          })
        }
      }
    }
  }
}
