import { ActionSystem } from '../systems/ActionSystem'
import { CollisionSystem } from '../systems/CollisionSystem'
import { CookingSystem } from '../systems/CookingSystem'
import { MovementSystem } from '../systems/MovementSystem'

export class GameLoop {
  private running: boolean = false
  private lastTime: number = 0

  // Systems
  public movementSystem: MovementSystem
  public collisionSystem: CollisionSystem
  public cookingSystem: CookingSystem
  public actionSystem: ActionSystem

  constructor() {
    this.movementSystem = new MovementSystem()
    this.collisionSystem = new CollisionSystem()
    this.cookingSystem = new CookingSystem()
    this.actionSystem = new ActionSystem()
  }

  public start() {
    this.running = true
    this.lastTime = performance.now()
    this.loop()
  }

  public stop() {
    this.running = false
  }

  private loop = () => {
    if (!this.running) return

    const now = performance.now()
    const deltaTime = (now - this.lastTime) / 1000 // Seconds
    this.lastTime = now

    // Pause Logic could go here (skip everything except UI)
    // For now, we run systems normally but might want to slow them down

    this.update(deltaTime)

    requestAnimationFrame(this.loop)
  }

  private update(dt: number) {
    // ECS-like update order
    this.actionSystem.update(dt)
    this.movementSystem.update(dt)
    this.collisionSystem.update(dt)
    this.cookingSystem.update(dt)
  }
}
