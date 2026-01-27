import { AINPC } from '../entities/AINPC'
import { StateMachine } from './StateMachine'
import { Perception } from './Perception'
import { KitchenScene } from '../scenes/KitchenScene'
import { Order } from '../systems/OrderManager'

// Import States (Circular dep possible, handle carefully)
import { IdleState } from './states/IdleState'

export class NPCBrain {
  public npc: AINPC
  public stateMachine: StateMachine
  public perception: Perception

  // Memory
  public currentOrder: Order | null = null
  public targetStationId: string | null = null

  // Configuration
  public reactionTime: number = 1000 // ms between major decisions
  private timer: number = 0

  constructor(npc: AINPC, scene: KitchenScene) {
    this.npc = npc
    this.perception = new Perception(npc, scene)
    this.stateMachine = new StateMachine(this)
  }

  public initialize() {
    // Start in Idle
    this.stateMachine.changeState(new IdleState())
  }

  public update(dt: number) {
    // Run State Machine
    this.stateMachine.update(dt)

    // Optional: Periodic high-level checks (interrupts)
    this.timer += dt
    if (this.timer > this.reactionTime) {
      this.timer = 0
      // this.checkInterrupts()
    }
  }
}
