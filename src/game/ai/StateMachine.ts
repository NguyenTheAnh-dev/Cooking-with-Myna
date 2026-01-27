import { NPCBrain } from './NPCBrain'

export interface State {
  name: string
  enter(brain: NPCBrain): void
  update(brain: NPCBrain, dt: number): void
  exit(brain: NPCBrain): void
}

export class StateMachine {
  private currentState: State | null = null
  private brain: NPCBrain

  constructor(brain: NPCBrain) {
    this.brain = brain
  }

  public changeState(newState: State) {
    if (this.currentState) {
      if (this.currentState.name === newState.name) return // No-op if same state
      this.currentState.exit(this.brain)
    }

    // console.log(`[AI ${this.brain.npc.id}] State: ${this.currentState?.name} -> ${newState.name}`)
    this.currentState = newState
    this.currentState.enter(this.brain)
  }

  public update(dt: number) {
    if (this.currentState) {
      this.currentState.update(this.brain, dt)
    }
  }

  public getCurrentStateName(): string {
    return this.currentState ? this.currentState.name : 'none'
  }
}
