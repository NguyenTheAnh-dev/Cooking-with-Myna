import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { ProcessOrderState } from './ProcessOrderState'
import { WashDishState } from './WashDishState'

export class IdleState implements State {
  name = 'idle'

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    brain.npc.velocity = { x: 0, y: 0 }
    brain.npc.targetPosition = null
  }

  update(brain: NPCBrain) {
    // Priority 1: Check if we need to wash dishes (low clean plates)
    if (brain.perception.needsCleanPlates()) {
      brain.stateMachine.changeState(new WashDishState())
      return
    }

    // Priority 2: Look for orders to process
    const orders = brain.perception.findActiveOrders()
    if (orders.length > 0) {
      brain.currentOrder = orders[0]
      brain.stateMachine.changeState(new ProcessOrderState(brain.currentOrder))
      return
    }

    // Priority 3: If idle and dirty dishes exist, wash them proactively
    if (brain.perception.hasDirtyPlates()) {
      brain.stateMachine.changeState(new WashDishState())
    }
  }

  exit() {}
}
