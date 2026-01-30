import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { MoveToState } from './MoveToState'
import { IdleState } from './IdleState'

/**
 * ChopState: AI places item on cutting board and chops it
 */
export class ChopState implements State {
  name = 'chop'
  private nextState: State | null

  constructor(nextState: State | null = null) {
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    // Find nearest available cutting station
    const cuttingBoard = brain.perception.findNearestStation('cut')

    if (!cuttingBoard) {
      console.log('[AI] No cutting station available')
      brain.stateMachine.changeState(new IdleState())
      return
    }

    // Move to cutting station
    const chopAction = new ChoppingAction(this.nextState)
    const moveToCut = new MoveToState(cuttingBoard.x, cuttingBoard.y + 60, chopAction)

    brain.targetStationId = cuttingBoard.id
    brain.stateMachine.changeState(moveToCut)
  }

  update() {}
  exit() {}
}

/**
 * ChoppingAction: Wait at cutting board until item is chopped
 */
class ChoppingAction implements State {
  name = 'chopping_action'
  private waitTime = 0
  private readonly chopDuration = 2000 // 2 seconds to chop
  private nextState: State | null

  constructor(nextState: State | null = null) {
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('cook') // Use cook visual for now
    this.waitTime = 0

    const item = brain.npc.holdingItem
    if (item) {
      console.log(`[AI] Started chopping ${item.type}`)
    }
  }

  update(brain: NPCBrain, dt: number) {
    this.waitTime += dt * 1000

    // Simulate chopping progress
    if (this.waitTime >= this.chopDuration) {
      const item = brain.npc.holdingItem
      if (item) {
        item.setState('chopped')
        console.log(`[AI] Finished chopping ${item.type}`)
      }

      if (this.nextState) {
        brain.stateMachine.changeState(this.nextState)
      } else {
        brain.stateMachine.changeState(new IdleState())
      }
    }
  }

  exit(brain: NPCBrain) {
    brain.npc.setVisualState('idle')
  }
}

export { ChoppingAction }
