import { EventBus } from '../core/EventBus'

export interface Order {
  id: string
  recipeId: string
  timeLeft: number
  status: 'pending' | 'completed' | 'failed'
}

export class OrderManager {
  private orders: Order[] = []
  private orderIdCounter = 0
  private maxOrders = 3

  constructor() {
    // Auto-generate orders for demo
    setInterval(() => this.generateOrder(), 5000)
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

  private generateOrder() {
    if (this.orders.length >= this.maxOrders) return

    const recipes = ['tomato_soup', 'steak'] // Matches RecipeSystem keys
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

    const newOrder: Order = {
      id: `order-${++this.orderIdCounter}`,
      recipeId: randomRecipe,
      timeLeft: 60,
      status: 'pending',
    }

    this.orders.push(newOrder)
    EventBus.getInstance().emit('ORDER_NEW', newOrder)

    console.log(`[OrderManager] New Order: ${randomRecipe}`)
  }
}
