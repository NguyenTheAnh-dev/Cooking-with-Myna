import { Container, Sprite, Texture, Graphics } from 'pixi.js'

export type ItemType =
  | 'tomato'
  | 'steak'
  | 'salad'
  | 'burger'
  | 'lettuce'
  | 'bread'
  | 'meat'
  | 'cheese'
  | 'pot'
  | 'pan'

export type CookingState = 'raw' | 'chopped' | 'cooked' | 'burnt' | 'plated'

export class Item extends Container {
  public id: string
  public type: ItemType
  public state: CookingState = 'raw'
  public heldBy: string | null = null // Character ID

  private sprite: Sprite | null = null

  constructor(id: string, type: ItemType) {
    super()
    this.id = id
    this.type = type

    this.draw()
  }

  public setState(newState: CookingState) {
    this.state = newState
    this.draw()
  }

  private draw() {
    this.removeChildren()

    // Map item type to sprite file
    const spriteMap: Record<ItemType, string> = {
      tomato: 'tomato',
      steak: 'steak',
      salad: 'salad',
      burger: 'burger',
      lettuce: 'lettuce',
      bread: 'bread',
      meat: 'meat',
      cheese: 'cheese',
      pot: 'pot',
      pan: 'pan',
    }

    const spriteName = spriteMap[this.type]

    // Check if it's a dish (final product) or ingredient
    const isDish = ['steak', 'salad', 'burger'].includes(this.type) && this.state === 'plated'
    const basePath = isDish ? '/sprites/dishes' : '/sprites/items'

    try {
      const texture = Texture.from(`${basePath}/${spriteName}.png`)
      this.sprite = new Sprite(texture)
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(0.4)
      this.addChild(this.sprite)
    } catch {
      // Fallback to graphics if sprite not found
      const g = new Graphics()
      g.circle(0, 0, 15)

      if (this.type === 'tomato') g.fill(0xff6347)
      else if (this.type === 'meat') g.fill(0x8b4513)
      else if (this.type === 'lettuce') g.fill(0x2ecc71)
      else if (this.type === 'bread') g.fill(0xdeb887)
      else if (this.type === 'cheese') g.fill(0xffd700)
      else g.fill(0xcccccc)

      this.addChild(g)
    }

    // Status indicator overlay
    if (this.state === 'burnt') {
      const overlay = new Graphics()
      overlay.circle(0, 0, 18)
      overlay.fill({ color: 0x000000, alpha: 0.5 })
      this.addChild(overlay)
    } else if (this.state === 'cooked') {
      const glow = new Graphics()
      glow.circle(0, 0, 20)
      glow.stroke({ width: 2, color: 0xffd700 })
      this.addChildAt(glow, 0)
    }
  }
}
