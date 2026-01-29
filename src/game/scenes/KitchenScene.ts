import { Container, Graphics, Ticker, Sprite, Assets } from 'pixi.js'
import { CharacterManager } from '../managers/CharacterManager'
import { DishManager } from '../managers/DishManager'
import { GameLoop } from '../core/GameLoop'
import { Station } from '../entities/Station'
import { OrderManager } from '../systems/OrderManager'
import { TutorialManager } from '../tutorial/TutorialManager'
import { setupBasicTutorial } from '../tutorial/steps/TutorialSequence'
import { KitchenLoader } from '../editor/KitchenLoader'
import { MobileHUD } from '../ui/MobileHUD'
import { InputManager } from '../input/InputManager'
import { KeyboardController } from '../input/KeyboardController'
import { KitchenLayout } from '../types/KitchenLayout'
import level1 from '../data/level_1.json'

export class KitchenScene extends Container {
  public characterManager: CharacterManager
  public orderManager: OrderManager
  public dishManager: DishManager
  public stations: Station[] = []

  public tutorialManager: TutorialManager
  private currentLevel: KitchenLayout
  private hudLayer: MobileHUD

  constructor(levelConfig: KitchenLayout | null = null) {
    super()

    InputManager.getInstance().addController(new KeyboardController())

    this.currentLevel = levelConfig || (level1 as KitchenLayout)

    this.orderManager = new OrderManager()

    this.drawBackground()
    this.setupStations()

    this.characterManager = new CharacterManager(this)
    this.dishManager = new DishManager(this)
    this.tutorialManager = new TutorialManager(this)

    this.spawnPlayer()

    setupBasicTutorial(this.tutorialManager)
    this.tutorialManager.start()

    Ticker.shared.add((ticker) => {
      this.tutorialManager.update(ticker.deltaTime / 60)
      InputManager.getInstance().update()
    })

    this.hudLayer = new MobileHUD()
    this.addChild(this.hudLayer)
  }

  public setupSystems(gameLoop: GameLoop) {
    gameLoop.movementSystem.setManager(this.characterManager)
    gameLoop.actionSystem.setManager(this.characterManager)
  }

  private drawBackground() {
    const floor = new Graphics()
    floor.rect(0, 0, 1200, 800)
    floor.fill(0xececec)
    this.addChild(floor)

    const bgKey = (this.currentLevel as any).background || 'bg_level_1'

    try {
      const texture = Assets.get(bgKey)
      if (texture) {
        const bgSprite = new Sprite(texture)
        bgSprite.width = 1200
        bgSprite.height = 800
        this.addChild(bgSprite)
      }
    } catch (e) {
      console.warn('Background image not found:', bgKey)
    }
  }

  private setupStations() {
    const levelData = this.currentLevel

    const entities = KitchenLoader.load(this, levelData)

    entities.forEach((e) => {
      if (e instanceof Station) {
        this.stations.push(e)
      }
    })
  }

  private spawnPlayer() {
    const players = [
      { id: 'player-1', name: 'Player 1', x: 400, y: 600, texture: 'char-boy-1' },
      { id: 'player-2', name: 'Player 2', x: 800, y: 600, texture: 'char-girl-1' },
    ]

    players.forEach((p) => {
      this.characterManager.spawnCharacter({
        id: p.id,
        name: p.name,
        startPosition: { x: p.x, y: p.y },
        speed: 250,
        textureId: p.texture,
        isAI: false,
      })
    })
  }
}
