import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { InteractState } from './InteractState'
import { IdleState } from './IdleState'
import { Order } from '../../systems/OrderManager'

export class ProcessOrderState implements State {
  name = 'process_order'
  private order: Order

  constructor(order: Order) {
    this.order = order
  }

  enter(brain: NPCBrain) {
    this.evaluateNextStep(brain)
  }

  update() {
    // This state mostly acts as a router.
    // It immediately delegates to MoveTo -> Interact -> (Back to ProcessOrder)
  }

  exit() {}

  private evaluateNextStep(brain: NPCBrain) {
    const step = brain.perception.determineNextRecipeStep(this.order)

    if (!step) {
      brain.stateMachine.changeState(new IdleState())
      return
    }

    const station = brain.perception.findNearestStation(step.station)
    if (station) {
      const nextEval = new ProcessOrderState(this.order)
      const doAction = new InteractState(2000, nextEval)
      const moveTo = new MoveToState(station.x, station.y + 60, doAction)

      brain.stateMachine.changeState(moveTo)
    } else {
      brain.stateMachine.changeState(new IdleState())
    }
  }
}
