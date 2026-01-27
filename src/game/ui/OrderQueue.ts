import { Container, Graphics, Text } from 'pixi.js'
import { Order } from '../systems/OrderManager'

interface OrderCardData {
  order: Order
  card: Container
}

export class OrderQueue extends Container {
  private orders: OrderCardData[] = []
  private cardWidth: number = 100
  private cardHeight: number = 80
  private spacing: number = 10

  constructor() {
    super()
  }

  public addOrder(order: Order) {
    const card = this.createOrderCard(order)
    card.x = this.orders.length * (this.cardWidth + this.spacing)
    this.addChild(card)
    this.orders.push({ order, card })
  }

  public removeOrder(orderId: string) {
    const index = this.orders.findIndex((o) => o.order.id === orderId)
    if (index !== -1) {
      const { card } = this.orders[index]
      this.removeChild(card)
      this.orders.splice(index, 1)
      this.repositionCards()
    }
  }

  public updateOrder(orderId: string, timeRemaining: number, totalTime: number = 60) {
    const orderData = this.orders.find((o) => o.order.id === orderId)
    if (orderData) {
      this.updateCardTimer(orderData.card, timeRemaining, totalTime)
    }
  }

  private createOrderCard(order: Order): Container {
    const card = new Container()

    // Background
    const bg = new Graphics()
    bg.roundRect(0, 0, this.cardWidth, this.cardHeight, 8)
    bg.fill({ color: 0x3a3a3a })
    bg.stroke({ width: 2, color: 0xffd700 })
    card.addChild(bg)

    // Recipe name
    const name = new Text({
      text: order.recipeId.replace('_', ' '),
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        fill: 0xffffff,
      },
    })
    name.x = 5
    name.y = 5
    card.addChild(name)

    // Timer bar background
    const timerBg = new Graphics()
    timerBg.rect(5, this.cardHeight - 15, this.cardWidth - 10, 8)
    timerBg.fill({ color: 0x555555 })
    card.addChild(timerBg)

    // Timer bar fill
    const timerFill = new Graphics()
    timerFill.rect(5, this.cardHeight - 15, this.cardWidth - 10, 8)
    timerFill.fill({ color: 0x00ff00 })
    timerFill.name = 'timerFill'
    card.addChild(timerFill)

    return card
  }

  private updateCardTimer(card: Container, timeRemaining: number, totalTime: number) {
    const timerFill = card.getChildByName('timerFill') as Graphics
    if (timerFill) {
      const ratio = Math.max(0, timeRemaining / totalTime)
      const width = (this.cardWidth - 10) * ratio

      timerFill.clear()
      timerFill.rect(5, this.cardHeight - 15, width, 8)

      // Color based on time
      let color = 0x00ff00
      if (ratio < 0.3) color = 0xff0000
      else if (ratio < 0.6) color = 0xffaa00

      timerFill.fill({ color })
    }
  }

  private repositionCards() {
    this.orders.forEach((orderData, index) => {
      orderData.card.x = index * (this.cardWidth + this.spacing)
    })
  }

  public clear() {
    this.orders.forEach(({ card }) => this.removeChild(card))
    this.orders = []
  }
}
