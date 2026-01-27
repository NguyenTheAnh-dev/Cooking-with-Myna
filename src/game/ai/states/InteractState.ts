import { State } from '../StateMachine'
import type { NPCBrain } from '../NPCBrain'
import { IdleState } from './IdleState'

export class InteractState implements State {
  name = 'interact'
  private duration: number
  private nextState: State | null
  private timer: number = 0

  constructor(duration: number, nextState: State | null = null) {
    this.duration = duration
    this.nextState = nextState
  }

  enter(brain: NPCBrain) {
    brain.npc.setVisualState('cook')
    this.timer = 0
  }

  update(brain: NPCBrain, dt: number) {
    this.timer += dt
    if (this.timer >= this.duration) {
      this.simulateInteractionResult(brain)

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

  private simulateInteractionResult(brain: NPCBrain) {
    // This is a HACK to simulate game logic updates without a full InteractionSystem
    // In real game, the server/system would update the Character's held item.

    // If we were getting a raw ingredient...
    if (!brain.npc.holdingItem) {
      // Assume we picked something up
      // brain.npc.holdingItem = { type: 'tomato', state: 'raw' }...
      // We can't easily fetch 'Item' class here without circular deps or factory.
      // Ignoring actual item logic for movement test, just assume success.
    }
  }
}
