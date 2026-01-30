import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { IdleState } from './IdleState'
import { EventBus } from '../../core/EventBus'

/**
 * ServeState: AI delivers plated dish to serve window
 */
export class ServeState implements State {
  name = 'serve'

  enter(brain: NPCBrain) {
    // Find serve station
    const serveStation = brain.perception.findNearestStation('serve')

    if (!serveStation) {
      console.log('[AI] No serve station available')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Move to serve station
    const serveAction = new ServingAction()
    const moveToServe = new MoveToState(serveStation.x, serveStation.y + 60, serveAction)

    brain.stateMachine.changeState(moveToServe)
  }

  update() {}
  exit() {}
}

/**
 * ServingAction: Complete the order
 */
class ServingAction implements State {
  name = 'serving_action'
  private timer = 0
  private readonly duration = 500 // 0.5 seconds to serve

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    this.timer = 0
  }

  update(brain: NPCBrain, dt: number) {
    this.timer += dt * 1000

    if (this.timer >= this.duration) {
      const item = brain.npc.holdingItem
      const order = brain.currentOrder

      if (item && order) {
        // Complete the order
        console.log(`[AI] Served ${item.type} for order ${order.id}`)

        // Emit order completion event
        EventBus.getInstance().emit('ORDER_COMPLETED', {
          recipeId: order.recipeId,
          completedBy: brain.npc.id,
        })

        // Remove item from NPC
        brain.npc.removeChild(item)
        brain.npc.holdingItem = null
        brain.currentOrder = null
      }

      // Return to idle
      brain.stateMachine.changeState(new IdleState())
    }
  }

  exit() {}
}

export { ServingAction }
