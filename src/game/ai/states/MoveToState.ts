import { State } from '../StateMachine'
import { NPCBrain } from '../NPCBrain'
import { EventBus } from '../../core/EventBus'

export class MoveToState implements State {
  name = 'move_to'
  private targetX: number
  private targetY: number
  private arrivalThreshold = 5
  private nextState: State | null

  constructor(targetX: number, targetY: number, nextState: State | null = null) {
    this.targetX = targetX
    this.targetY = targetY
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('walk')

    // Issue move command via ActionSystem (simulated by EventBus)
    EventBus.getInstance().emit('PLAYER_MOVE', {
      characterId: brain.npc.id,
      x: this.targetX,
      y: this.targetY,
    })
  }

  update(brain: NPCBrain, _dt: number) {
    const dx = brain.npc.x - this.targetX
    const dy = brain.npc.y - this.targetY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < this.arrivalThreshold) {
      brain.npc.velocity = { x: 0, y: 0 } // Stop
      if (this.nextState) {
        brain.stateMachine.changeState(this.nextState)
      } else {
        // Default to Idle if no next state
        // In a complex tree, we might return Success
        brain.stateMachine.changeState(new (require('./IdleState').IdleState)())
      }
    }
  }

  exit(_brain: NPCBrain) {}
}
