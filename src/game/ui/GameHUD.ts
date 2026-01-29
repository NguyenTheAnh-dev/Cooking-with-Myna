import { Container } from 'pixi.js'
import { Timer } from './Timer'
import { ScoreDisplay } from './ScoreDisplay'
import { OrderQueue } from './OrderQueue'
import { EventBus } from '../core/EventBus'
import { Order } from '../systems/OrderManager'

export class GameHUD extends Container {
  public timer: Timer
  public scoreDisplay: ScoreDisplay
  public orderQueue: OrderQueue

  private screenWidth: number
  private screenHeight: number

  constructor(screenWidth: number = 1200, screenHeight: number = 800) {
    super()
    this.screenWidth = screenWidth
    this.screenHeight = screenHeight

    // Timer (top-right)
    this.timer = new Timer(180000) // 3 minutes
    this.timer.x = screenWidth - 140
    this.timer.y = 20
    this.addChild(this.timer)

    // Score (top-left)
    this.scoreDisplay = new ScoreDisplay()
    this.scoreDisplay.x = 20
    this.scoreDisplay.y = 20
    this.addChild(this.scoreDisplay)

    // Order Queue (top-center)
    this.orderQueue = new OrderQueue()
    this.orderQueue.x = 200
    this.orderQueue.y = 20
    this.addChild(this.orderQueue)

    // Listen to game events
    this.setupEventListeners()
  }

  private setupEventListeners() {
    const bus = EventBus.getInstance()

    bus.on('ORDER_CREATED', (payload) => {
      const order = payload as Order
      this.orderQueue.addOrder(order)
    })

    bus.on('ORDER_COMPLETED', (payload) => {
      const { orderId, score } = payload as { orderId: string; score: number }
      this.orderQueue.removeOrder(orderId)
      this.scoreDisplay.addScore(score)
    })

    bus.on('ORDER_EXPIRED', (payload) => {
      const { orderId } = payload as { orderId: string }
      this.orderQueue.removeOrder(orderId)
    })
  }

  public update(dt: number) {
    this.timer.update(dt)
    this.scoreDisplay.update()
  }

  public startGame() {
    this.timer.start()
  }

  public pauseGame() {
    this.timer.pause()
  }

  public resetGame() {
    this.timer.reset(180000)
    this.scoreDisplay.setScore(0)
    this.orderQueue.clear()
  }

  public setTimerCallback(callback: () => void) {
    this.timer.setOnComplete(callback)
  }
}
