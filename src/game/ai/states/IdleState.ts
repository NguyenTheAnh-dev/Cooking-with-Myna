import { State } from '../StateMachine'
import { NPCBrain } from '../NPCBrain'
// import { FindOrderState } from './FindOrderState'

export class IdleState implements State {
  name = 'idle'

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    brain.npc.velocity = { x: 0, y: 0 }
    brain.npc.targetPosition = null
  }

  update(brain: NPCBrain, _dt: number) {
    // Simple logic: If we have no order, look for one.
    // In a real implementation this would transition to FindOrderState
    // For now we just check direct perception

    const orders = brain.perception.findActiveOrders()
    if (orders.length > 0) {
      // Found order!
      brain.currentOrder = orders[0]
      brain.stateMachine.changeState(
        new (require('./ProcessOrderState').ProcessOrderState)(brain.currentOrder)
      )
    }
  }

  exit(_brain: NPCBrain) {}
}
