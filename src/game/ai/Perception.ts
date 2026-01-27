import { KitchenScene } from '../scenes/KitchenScene'
import { Station, StationType } from '../entities/Station'
import { Order } from '../systems/OrderManager'
import { RecipeSystem, RecipeStep } from '../systems/RecipeSystem'
import { AINPC } from '../entities/AINPC'

export class Perception {
  private scene: KitchenScene
  private npc: AINPC

  constructor(npc: AINPC, scene: KitchenScene) {
    this.npc = npc
    this.scene = scene
  }

  public findActiveOrders(): Order[] {
    return this.scene.orderManager?.getOrders() || []
  }

  public findNearestStation(type: StationType): Station | null {
    const stations = this.scene.stations
    if (!stations) return null

    let nearest: Station | null = null
    let minDist = Infinity

    for (const station of stations) {
      if (station.type === type && !station.isOccupied) {
        const dist = this.getDistance(station.x, station.y)
        if (dist < minDist) {
          minDist = dist
          nearest = station
        }
      }
    }
    return nearest
  }

  public determineNextRecipeStep(order: Order): RecipeStep | null {
    const heldItem = this.npc.holdingItem
    const itemType = heldItem ? heldItem.type : null
    const itemState = heldItem ? heldItem.state : 'raw'

    // If we have nothing, we probably need the raw ingredient for the recipe
    // This is a simplification. A real planner would be more complex.
    // RecipeSystem.getRecipe(order.recipeId)
    // ... logic to find what we don't have.

    // Simplification for prototype:
    // If holding nothing -> Get Raw Ingredient (First step required item)
    // If holding something -> Get Next Step

    const recipe = RecipeSystem.getRecipe(order.recipeId)
    if (!recipe) return null

    if (!heldItem) {
      // Needs first ingredient
      // Assume first step's required item is the raw ingredient we need to fetch
      // In a real game, 'ingredients' would be distinct from 'steps', but here step 1 implies it.
      const firstStep = recipe.steps[0]
      return {
        requiredItem: firstStep.requiredItem,
        requiredState: 'raw',
        station: 'counter', // Assuming counters have ingredients spawning
        action: 'chop', // Dummy action
        nextState: 'raw', // Just fetching
      }
    }

    return RecipeSystem.getNextStep(order.recipeId, itemType!, itemState)
  }

  private getDistance(tx: number, ty: number): number {
    const dx = tx - this.npc.x
    const dy = ty - this.npc.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Check if there are dirty plates that need washing
   */
  public hasDirtyPlates(): boolean {
    const dishManager = this.scene.dishManager
    return dishManager ? dishManager.getDirtyPlateCount() > 0 : false
  }

  /**
   * Check if clean plates are running low
   */
  public needsCleanPlates(): boolean {
    const dishManager = this.scene.dishManager
    if (!dishManager) return false
    return dishManager.getCleanPlateCount() < 2 && dishManager.getDirtyPlateCount() > 0
  }

  /**
   * Get the dish manager from scene
   */
  public getDishManager() {
    return this.scene.dishManager ?? null
  }
}
