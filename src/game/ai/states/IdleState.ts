import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { ProcessOrderState } from './ProcessOrderState'

export class IdleState implements State {
  name = 'idle'

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    brain.npc.velocity = { x: 0, y: 0 }
    brain.npc.targetPosition = null
  }

  update(brain: NPCBrain) {
    // Simple logic: If we have no order, look for one.

    const orders = brain.perception.findActiveOrders()
    if (orders.length > 0) {
      // Found order!
      brain.currentOrder = orders[0]
      brain.stateMachine.changeState(new ProcessOrderState(brain.currentOrder))
    }
  }

  exit() {}
}
