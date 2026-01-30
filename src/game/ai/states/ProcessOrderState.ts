import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { IdleState } from './IdleState'
import { FetchIngredientState } from './FetchIngredientState'
import { CookState } from './CookState'
import { PlateState } from './PlateState'
import { ServeState } from './ServeState'
import { Order } from '../../systems/OrderManager'
import { RecipeSystem } from '../../systems/RecipeSystem'

/**
 * ProcessOrderState: Coordinates the full cooking flow for an order
 * Flow: FetchIngredient -> Cook -> Plate -> Serve
 */
export class ProcessOrderState implements State {
  name = 'process_order'
  private order: Order

  constructor(order: Order) {
    this.order = order
  }

  enter(brain: NPCBrain) {
    brain.currentOrder = this.order
    this.startCookingFlow(brain)
  }

  update() {}
  exit() {}

  private startCookingFlow(brain: NPCBrain) {
    const recipe = RecipeSystem.getRecipe(this.order.recipeId)
    if (!recipe) {
      console.log(`[AI] Unknown recipe: ${this.order.recipeId}`)
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Get the first ingredient needed
    const ingredients = recipe.ingredients
    if (ingredients.length === 0) {
      brain.stateMachine.changeState(new IdleState())
      return
    }

    const firstIngredient = ingredients[0]
    console.log(`[AI] Starting order ${this.order.id}: ${recipe.name}`)
    console.log(`[AI] First ingredient: ${firstIngredient}`)

    // Build the cooking chain in reverse order:
    // Serve (final) <- Plate <- Cook <- Fetch (start)
    const serveState = new ServeState()
    const plateState = new PlateState(serveState)
    const cookState = new CookState(plateState)
    const fetchState = new FetchIngredientState(firstIngredient, cookState)

    brain.stateMachine.changeState(fetchState)
  }
}
