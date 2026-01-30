import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { IdleState } from './IdleState'

/**
 * CookState: AI places item on stove and waits for it to cook
 */
export class CookState implements State {
  name = 'cook'
  private nextState: State | null

  constructor(nextState: State | null = null) {
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    // Find nearest available stove
    const stove = brain.perception.findNearestStation('stove')

    if (!stove) {
      console.log('[AI] No stove available')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Move to stove
    const cookAction = new CookingAction(this.nextState)
    const moveToStove = new MoveToState(stove.x, stove.y + 60, cookAction)

    brain.targetStationId = stove.id
    brain.stateMachine.changeState(moveToStove)
  }

  update() {}
  exit() {}
}

/**
 * CookingAction: Wait at stove until item is cooked
 */
class CookingAction implements State {
  name = 'cooking_action'
  private waitTime = 0
  private readonly maxWait = 10000 // 10 seconds max wait
  private nextState: State | null

  constructor(nextState: State | null = null) {
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('cook')
    this.waitTime = 0

    const item = brain.npc.holdingItem
    if (item) {
      console.log(`[AI] Started cooking ${item.type}`)
    }
  }

  update(brain: NPCBrain, dt: number) {
    this.waitTime += dt * 1000

    // Check if item is cooked
    const item = brain.npc.holdingItem
    if (item && item.state === 'cooked') {
      console.log(`[AI] Item cooked, moving to next state`)
      if (this.nextState) {
        brain.stateMachine.changeState(this.nextState)
      } else {
        brain.stateMachine.changeState(new IdleState())
      }
      return
    }

    // Simulate cooking progress (in real implementation, CookingSystem handles this)
    if (this.waitTime >= 3000 && item) {
      item.setState('cooked')
    }

    // Timeout protection
    if (this.waitTime >= this.maxWait) {
      console.log('[AI] Cooking timeout, returning to idle')
      brain.stateMachine.changeState(new IdleState())
    }
  }

  exit(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
  }
}

export { CookingAction }
