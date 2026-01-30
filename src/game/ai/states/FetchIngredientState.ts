import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { IdleState } from './IdleState'
import { Item, ItemType } from '../../entities/Item'
import { nanoid } from 'nanoid'

/**
 * FetchIngredientState: AI goes to fridge/counter to pick up a raw ingredient
 */
export class FetchIngredientState implements State {
  name = 'fetch_ingredient'
  private ingredientType: ItemType
  private nextState: State

  constructor(ingredientType: ItemType, nextState: State) {
    this.ingredientType = ingredientType
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    // Find a fridge or counter to get ingredients from
    const fridge = brain.perception.findNearestStation('fridge')

    if (!fridge) {
      console.log('[AI] No fridge found, returning to idle')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Move to the fridge first
    const pickupAction = new PickupIngredientAction(this.ingredientType, this.nextState)
    const moveToFridge = new MoveToState(fridge.x, fridge.y + 60, pickupAction)

    brain.stateMachine.changeState(moveToFridge)
  }

  update() {}
  exit() {}
}

/**
 * PickupIngredientAction: Executed when AI reaches the fridge
 */
class PickupIngredientAction implements State {
  name = 'pickup_ingredient'
  private ingredientType: ItemType
  private nextState: State
  private timer = 0
  private readonly duration = 1000 // 1 second to pick up

  constructor(ingredientType: ItemType, nextState: State) {
    this.ingredientType = ingredientType
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    brain.npc.velocity = { x: 0, y: 0 }
    this.timer = 0
  }

  update(brain: NPCBrain, dt: number) {
    this.timer += dt * 1000

    if (this.timer >= this.duration) {
      // Create the ingredient item and attach to NPC
      const item = new Item(nanoid(), this.ingredientType)
      brain.npc.holdingItem = item
      brain.npc.addChild(item)
      item.y = -30 // Position above character

      console.log(`[AI] Picked up ${this.ingredientType}`)

      // Move to next state (usually CookState or ChopState)
      brain.stateMachine.changeState(this.nextState)
    }
  }

  exit() {}
}

export { PickupIngredientAction }
