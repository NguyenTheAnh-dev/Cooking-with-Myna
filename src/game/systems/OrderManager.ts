import { EventBus } from '../core/EventBus'

export interface Order {
  id: string
  recipeId: string
  timeRemaining: number // seconds
  totalTime: number // seconds
  status: 'pending' | 'completed' | 'failed'
}

export class OrderManager {
  private orders: Order[] = []
  private orderIdCounter = 0
  private maxOrders = 4 // Default for 2 players
  private generationIntervalMs = 6000 // 6 seconds per order
  private generationTimer: NodeJS.Timeout | null = null

  constructor(difficultyMultiplier: number = 1) {
    // Adjust based on difficulty/players
    // E.g., multiplier 1 = Normal (2 players)
    this.maxOrders = Math.floor(4 * difficultyMultiplier)
    this.generationIntervalMs = Math.floor(6000 / difficultyMultiplier)
  }

  public startGeneration() {
    if (this.generationTimer) clearInterval(this.generationTimer)
    this.generateOrder() // Generate one immediately
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

  public completeOrder(recipeId: string): boolean {
    const index = this.orders.findIndex((o) => o.recipeId === recipeId && o.status === 'pending')
    if (index !== -1) {
      this.orders.splice(index, 1)
      EventBus.getInstance().emit('ORDER_COMPLETED', { recipeId })
      return true
    }
    return false
  }

  public generateOrder() {
    if (this.orders.length >= this.maxOrders) return

    const recipes = ['tomato_soup', 'steak'] // Matches RecipeSystem keys
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

    const newOrder: Order = {
      id: `order-${++this.orderIdCounter}`,
      recipeId: randomRecipe,
      timeRemaining: 60,
      totalTime: 60,
      status: 'pending',
    }

    this.orders.push(newOrder)
    EventBus.getInstance().emit('ORDER_NEW', newOrder)

    console.log(`[OrderManager] New Order: ${randomRecipe}`)
  }
}
