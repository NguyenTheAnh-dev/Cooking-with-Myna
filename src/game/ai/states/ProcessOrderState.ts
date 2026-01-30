import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { IdleState } from './IdleState'
import { FetchIngredientState } from './FetchIngredientState'
import { CookState } from './CookState'
import { ChopState } from './ChopState'
import { PlateState } from './PlateState'
import { ServeState } from './ServeState'
import { Order } from '../../systems/OrderManager'
import { RecipeSystem, RecipeStep } from '../../systems/RecipeSystem'
import { ItemType } from '../../entities/Item'

/**
 * ProcessOrderState: Coordinates the full cooking flow for an order
 * Handles multi-ingredient recipes by chaining fetch → process states
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

    const ingredients = recipe.ingredients
    if (ingredients.length === 0) {
      brain.stateMachine.changeState(new IdleState())
      return
    }

    console.log(`[AI] Starting order ${this.order.id}: ${recipe.name}`)
    console.log(`[AI] Ingredients needed: ${ingredients.join(', ')}`)

    // Build the processing chain for all ingredients
    // Final step: Serve
    const serveState = new ServeState()

    // Before serving: Plate all collected items
    const plateState = new PlateState(serveState)

    // Build chain backwards: last ingredient → first ingredient
    // Each ingredient: Fetch → Process (cook/chop based on recipe steps)
    let nextState: State = plateState

    // Process ingredients in reverse order to build chain
    for (let i = ingredients.length - 1; i >= 0; i--) {
      const ingredient = ingredients[i]
      const processState = this.createProcessStateForIngredient(ingredient, recipe.steps, nextState)
      const fetchState = new FetchIngredientState(ingredient, processState)
      nextState = fetchState
    }

    brain.stateMachine.changeState(nextState)
  }

  /**
   * Create appropriate processing state based on recipe steps
   */
  private createProcessStateForIngredient(
    ingredient: ItemType,
    steps: RecipeStep[],
    nextState: State
  ): State {
    // Find the step for this ingredient
    const step = steps.find((s) => s.requiredItem === ingredient && s.requiredState === 'raw')

    if (!step) {
      // No processing needed, go directly to next state
      return nextState
    }

    // Create appropriate state based on action
    switch (step.action) {
      case 'cook':
        return new CookState(nextState)
      case 'chop':
        return new ChopState(nextState)
      default:
        return nextState
    }
  }
}
