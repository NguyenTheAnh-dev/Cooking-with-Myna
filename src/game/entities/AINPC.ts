import { Character } from './Character'
import { NPCBrain } from '../ai/NPCBrain'
import { KitchenScene } from '../scenes/KitchenScene'

export class AINPC extends Character {
  public brain: NPCBrain | null = null

  constructor(id: string, textureId: string, scene: KitchenScene) {
    super(id, textureId)
    this.brain = new NPCBrain(this, scene)
    this.brain.initialize()
  }

  public update(dt: number) {
    this.brain?.update(dt)
  }
}
