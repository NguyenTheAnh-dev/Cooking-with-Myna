import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { IdleState } from './IdleState'
import { Plate } from '../../entities/Plate'

/**
 * AI State for washing dirty dishes
 * Flow: Pick up dirty plate → Move to sink → Wash (2 seconds) → Return clean plate
 */
export class WashDishState implements State {
  name = 'wash_dish'

  private phase: 'pickup' | 'move_to_sink' | 'washing' | 'return_plate' = 'pickup'
  private dirtyPlate: Plate | null = null
  private washTimer: number = 0
  private readonly WASH_TIME = 2000 // 2 seconds

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('walk')
    this.phase = 'pickup'
    this.startPickupPhase(brain)
  }

  private startPickupPhase(brain: NPCBrain) {
    // Find dish return station
    const dishReturn = brain.perception.findNearestStation('dish_return')
    if (!dishReturn) {
      console.log('[AI] No dish return station found, returning to idle')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Move to dish return
    brain.stateMachine.changeState(
      new MoveToState(dishReturn.x, dishReturn.y, new WashDishPickupState())
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_brain: NPCBrain, _dt: number) {
    // Main state just delegates to sub-phases
  }

  exit() {}
}

/**
 * Sub-state: Pick up dirty plate at dish return
 */
class WashDishPickupState implements State {
  name = 'wash_dish_pickup'

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    brain.npc.velocity = { x: 0, y: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(brain: NPCBrain, _dt: number) {
    // Try to pick up dirty plate
    const dishManager = brain.perception.getDishManager()
    if (!dishManager) {
      brain.stateMachine.changeState(new IdleState())
      return
    }

    const dirtyPlate = dishManager.pickupDirtyPlate()
    if (!dirtyPlate) {
      // No dirty plates, return to idle
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Store plate reference and move to sink
    brain.heldPlate = dirtyPlate

    const sink = brain.perception.findNearestStation('sink')
    if (!sink) {
      console.log('[AI] No sink found!')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    brain.stateMachine.changeState(new MoveToState(sink.x, sink.y, new WashDishWashingState()))
  }

  exit() {}
}

/**
 * Sub-state: Wash the dish at sink
 */
class WashDishWashingState implements State {
  name = 'wash_dish_washing'
  private washTimer = 0
  private readonly WASH_TIME = 2000

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('cook') // Reuse cook state for washing animation
    brain.npc.velocity = { x: 0, y: 0 }

    // Start washing
    if (brain.heldPlate) {
      brain.heldPlate.startWashing()
    }
  }

  update(brain: NPCBrain, dt: number) {
    if (!brain.heldPlate) {
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Update washing progress
    const isComplete = brain.heldPlate.updateWashing(dt)

    if (isComplete) {
      // Washing complete! Return plate
      const dishManager = brain.perception.getDishManager()
      if (dishManager) {
        dishManager.returnCleanPlate(brain.heldPlate)
      }

      brain.heldPlate = null
      console.log('[AI] Finished washing dish')

      // Go back to idle
      brain.stateMachine.changeState(new IdleState())
    }
  }

  exit(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
  }
}

export { WashDishPickupState, WashDishWashingState }
