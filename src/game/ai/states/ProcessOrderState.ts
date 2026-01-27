import { State } from '../StateMachine'
import { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { InteractState } from './InteractState'
import { Order } from '../../systems/OrderManager'

export class ProcessOrderState implements State {
  name = 'process_order'
  private order: Order

  constructor(order: Order) {
    this.order = order
  }

  enter(brain: NPCBrain) {
    // Plan the next step
    this.evaluateNextStep(brain)
  }

  update(brain: NPCBrain, _dt: number) {
    // This state mostly acts as a router.
    // It immediately delegates to MoveTo -> Interact -> (Back to ProcessOrder)
    // If we are here, it means we finished the previous actions and need to evaluate again.
    // But 'changeState' exits this state.
    // So checking logic is usually done in enter, or we have a specialized PlannerState.
    // To loop back, the sub-states need to transition back to NEW ProcessOrderState.
    // Or we pass 'this' as nextState? Passing 'this' re-enters logic.
  }

  exit(_brain: NPCBrain) {}

  private evaluateNextStep(brain: NPCBrain) {
    const step = brain.perception.determineNextRecipeStep(this.order)

    if (!step) {
      // Completed? Or Error?
      // Assume complete for now
      // console.log("Order seemingly complete or impossible")
      brain.stateMachine.changeState(new (require('./IdleState').IdleState)())
      return
    }

    // Find station for step
    const station = brain.perception.findNearestStation(step.station)
    if (station) {
      // Chain: Move -> Interact -> ProcessOrder (Re-eval)

      // Note: Cyclic dependency risk if we just new ProcessOrderState(this.order)
      // We'll use a factory or dynamic import or just re-instantiate.
      const nextEval = new ProcessOrderState(this.order)

      const doAction = new InteractState(2000, nextEval) // 2s interaction
      const moveTo = new MoveToState(station.x, station.y + 60, doAction) // +60 offset

      brain.stateMachine.changeState(moveTo)
    } else {
      // No station found? Wait.
      brain.stateMachine.changeState(new (require('./IdleState').IdleState)())
    }
  }
}
