import { EventBus } from '../core/EventBus'
import { RecipeSystem } from './RecipeSystem'

export interface Order {
  id: string
  recipeId: string
  timeRemaining: number // ms
  totalTime: number // ms
  status: 'pending' | 'completed' | 'failed'
  points: number // Points awarded on completion
}

export class OrderManager {
  private orders: Order[] = []
  private orderIdCounter = 0
  private maxOrders = 4
  private generationIntervalMs = 6000
  private generationTimer: NodeJS.Timeout | null = null
  private currentLevel = 1
  private availableRecipes: string[] = []

  constructor(level: number = 1, difficultyMultiplier: number = 1) {
    this.currentLevel = level
    this.maxOrders = Math.floor(4 * difficultyMultiplier)
    this.generationIntervalMs = Math.floor(6000 / difficultyMultiplier)

    // Get recipes available for this level
    this.availableRecipes = RecipeSystem.getRecipeIdsForLevel(level)
  }

  public setLevel(level: number) {
    this.currentLevel = level
    this.availableRecipes = RecipeSystem.getRecipeIdsForLevel(level)
  }

  public startGeneration() {
    if (this.generationTimer) clearInterval(this.generationTimer)
    this.generateOrder()
    this.generationTimer = setInterval(() => this.generateOrder(), this.generationIntervalMs)
  }

  public stopGeneration() {
    if (this.generationTimer) {
      clearInterval(this.generationTimer)
      this.generationTimer = null
    }
  }

  public addOrder(order: Order) {
    this.orders.push(order)
    EventBus.getInstance().emit('ORDER_NEW', order)
  }

  public getOrders(): Order[] {
    return this.orders
  }

  public completeOrder(recipeId: string): number {
    const index = this.orders.findIndex((o) => o.recipeId === recipeId && o.status === 'pending')
    if (index !== -1) {
      const order = this.orders[index]
      this.orders.splice(index, 1)
      EventBus.getInstance().emit('ORDER_COMPLETED', { recipeId, points: order.points })
      return order.points
    }
    return 0
  }

  public generateOrder() {
    if (this.orders.length >= this.maxOrders) return
    if (this.availableRecipes.length === 0) return

    // Weighted random: easier recipes more common early game
    const randomRecipeId =
      this.availableRecipes[Math.floor(Math.random() * this.availableRecipes.length)]

    const recipe = RecipeSystem.getRecipe(randomRecipeId)
    if (!recipe) return

    // Time limit based on difficulty
    const baseTime =
      recipe.difficulty === 'easy' ? 60000 : recipe.difficulty === 'medium' ? 75000 : 90000

    const newOrder: Order = {
      id: `order-${++this.orderIdCounter}`,
      recipeId: randomRecipeId,
      timeRemaining: baseTime,
      totalTime: baseTime,
      status: 'pending',
      points: recipe.points,
    }

    this.orders.push(newOrder)
    EventBus.getInstance().emit('ORDER_NEW', newOrder)

    console.log(`[OrderManager] New Order: ${recipe.name} (${recipe.difficulty})`)
  }

  public update(dt: number) {
    // Update order timers
    for (let i = this.orders.length - 1; i >= 0; i--) {
      const order = this.orders[i]
      if (order.status !== 'pending') continue

      order.timeRemaining -= dt * 1000

      if (order.timeRemaining <= 0) {
        order.status = 'failed'
        this.orders.splice(i, 1)
        EventBus.getInstance().emit('ORDER_FAILED', { orderId: order.id, recipeId: order.recipeId })
        console.log(`[OrderManager] Order FAILED: ${order.recipeId}`)
      }
    }
  }
}
