import { Character } from './Character'
import { Item } from './Item'
import { NPCBrain } from '../ai'
import { KitchenScene } from '../scenes/KitchenScene'

export type AISkillLevel = 'slow' | 'normal' | 'pro'

export class AINPC extends Character {
  public brain: NPCBrain | null = null
  public collectedItems: Item[] = [] // Track multiple ingredients for multi-ingredient recipes

  constructor(id: string, textureId: string, scene: KitchenScene, skill: AISkillLevel = 'normal') {
    super(id)
    // We might want to use textureId later, but for now parent ignores it or we set it manually
    // this.setTexture(textureId) // if we had such method

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

  /** Add an item to collected items (for multi-ingredient recipes) */
  public addToCollected(item: Item) {
    this.collectedItems.push(item)
  }

  /** Clear all collected items (after plating) */
  public clearCollected() {
    this.collectedItems = []
  }
}
