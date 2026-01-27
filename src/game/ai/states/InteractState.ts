import { State } from '../StateMachine'
import { NPCBrain } from '../NPCBrain'
import { EventBus } from '../../core/EventBus'

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
    // Determine interactions based on station?
    // For now, visual feedback
    brain.npc.setVisualState('cook') // Generic interaction anim
    this.timer = 0

    // Emit interaction event if we had an InteractionSystem
    // EventBus.getInstance().emit('PLAYER_INTERACT', { characterId: brain.npc.id })
  }

  update(brain: NPCBrain, dt: number) {
    this.timer += dt
    if (this.timer >= this.duration) {
      // Interaction complete

      // Logic to update inventory would happen here or via System response
      // For this prototype, we'll manually simulate the result to keep the AI moving
      this.simulateInteractionResult(brain)

      if (this.nextState) {
        brain.stateMachine.changeState(this.nextState)
      } else {
        brain.stateMachine.changeState(new (require('./IdleState').IdleState)())
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
