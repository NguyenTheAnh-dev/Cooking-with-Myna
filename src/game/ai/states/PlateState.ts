import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { IdleState } from './IdleState'

/**
 * PlateState: AI places cooked item on a plate
 */
export class PlateState implements State {
  name = 'plate'
  private nextState: State | null

  constructor(nextState: State | null = null) {
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    // Find nearest plate station
    const plateStation = brain.perception.findNearestStation('plate')

    if (!plateStation) {
      console.log('[AI] No plate station available')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Move to plate station
    const plateAction = new PlatingAction(this.nextState)
    const moveToPlate = new MoveToState(plateStation.x, plateStation.y + 60, plateAction)

    brain.stateMachine.changeState(moveToPlate)
  }

  update() {}
  exit() {}
}

/**
 * PlatingAction: Put item on plate
 */
class PlatingAction implements State {
  name = 'plating_action'
  private timer = 0
  private readonly duration = 500 // 0.5 seconds to plate
  private nextState: State | null

  constructor(nextState: State | null = null) {
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
    this.timer = 0
  }

  update(brain: NPCBrain, dt: number) {
    this.timer += dt * 1000

    if (this.timer >= this.duration) {
      const item = brain.npc.holdingItem
      if (item) {
        item.setState('plated')
        console.log(`[AI] Plated ${item.type}`)
      }

      if (this.nextState) {
        brain.stateMachine.changeState(this.nextState)
      } else {
        brain.stateMachine.changeState(new IdleState())
      }
    }
  }

  exit() {}
}

export { PlatingAction }
