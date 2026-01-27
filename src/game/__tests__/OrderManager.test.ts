import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { OrderManager, Order } from '../systems/OrderManager'

describe('OrderManager', () => {
  let orderManager: OrderManager

  beforeEach(() => {
    // Mock setInterval to prevent auto-generation
    vi.useFakeTimers()
    orderManager = new OrderManager(1.0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('constructor', () => {
    it('should create with default difficulty', () => {
      expect(orderManager).toBeDefined()
    })

    it('should adjust maxOrders based on difficulty', () => {
      const hardManager = new OrderManager(2.0)
      expect(hardManager).toBeDefined()
    })
  })

  describe('getOrders', () => {
    it('should return empty array initially', () => {
      const orders = orderManager.getOrders()
      expect(orders).toEqual([])
    })

    it('should return orders after auto-generation', () => {
      // Advance timer to trigger order generation
      vi.advanceTimersByTime(6000)

      const orders = orderManager.getOrders()
      expect(orders.length).toBe(1)
    })
  })

  describe('completeOrder', () => {
    it('should complete existing order', () => {
      // Generate an order first
      vi.advanceTimersByTime(6000)

      const orders = orderManager.getOrders()
      expect(orders.length).toBe(1)

      const result = orderManager.completeOrder(orders[0].recipeId)
      expect(result).toBe(true)
      expect(orderManager.getOrders().length).toBe(0)
    })

    it('should return false for non-existent recipe', () => {
      const result = orderManager.completeOrder('non_existent_recipe')
      expect(result).toBe(false)
    })
  })

  describe('order generation', () => {
    it('should not exceed maxOrders', () => {
      // Generate many orders
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(6000)
      }

      expect(orderManager.getOrders().length).toBeLessThanOrEqual(4)
    })

    it('should create orders with valid structure', () => {
      vi.advanceTimersByTime(6000)

      const orders = orderManager.getOrders()
      const order = orders[0]

      expect(order.id).toBeDefined()
      expect(order.recipeId).toBeDefined()
      expect(order.timeLeft).toBe(60)
      expect(order.status).toBe('pending')
    })
  })
})
