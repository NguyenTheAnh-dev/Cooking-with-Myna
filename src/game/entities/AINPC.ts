import { Character } from './Character'
import { NPCBrain } from '../ai'
import { KitchenScene } from '../scenes/KitchenScene'

export type AISkillLevel = 'slow' | 'normal' | 'pro'

export class AINPC extends Character {
  public brain: NPCBrain | null = null

  constructor(id: string, textureId: string, scene: KitchenScene, skill: AISkillLevel = 'normal') {
    super(id, textureId)

    // Adjust stats based on skill
    switch (skill) {
      case 'slow':
        this.speed = 150
        break
      case 'normal':
        this.speed = 200
        break
      case 'pro':
        this.speed = 300
        break
    }

    this.brain = new NPCBrain(this, scene)
    this.brain.initialize()
  }

  public update(dt: number) {
    this.brain?.update(dt)
  }
}
