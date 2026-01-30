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

      // Increase progress
      const duration = step.duration || 3
      station.progress += dt / duration

      EventBus.getInstance().emit('STATION_COOKING_TICK', {
        stationId: station.id,
        x: station.x,
        y: station.y,
      })

      if (station.progress >= 1) {
        // Cooking Complete
        station.progress = 1
        station.status = 'completed'

        // Update Item State
        currentItem.state = step.nextState
        console.log(`[CookingSystem] ${station.id} finished processing item!`)

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
        station.progress = 0 // Wait, logic in Station.ts handles progress > 1 visual.
        // But here we reset it?
        // If we want progress bar to go green -> red, we should probably Keep progress at 1 and add to it?
        // Station.ts logic: if (this.status === 'burning' || this.progress > 1)

        // Let's change strategy: Continue progress from 1.0 to 2.0
        station.status = 'burning'
        // progress is already 1.0
      }

      const burnTime = station.burnDuration || 5
      // rate to go from 1.0 to 2.0 in burnTime seconds
      station.progress += dt / burnTime

      if (station.progress >= 2) {
        station.status = 'burnt'
        station.progress = 1 // Reset to full bar (Gray)
        station.processedItem!.state = 'burnt'
        console.log(`[CookingSystem] ${station.id} BURNT the food!`)
        EventBus.getInstance().emit('STATION_BURNT', {
          stationId: station.id,
          x: station.x,
          y: station.y,
        })

        EventBus.getInstance().emit('ITEM_BURNT', {
          stationId: station.id,
          item: station.processedItem,
        })
      }
    }
  }
}
