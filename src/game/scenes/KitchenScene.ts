import { Container, Sprite, Application, Texture, Ticker } from 'pixi.js'
import { CharacterManager } from '../managers/CharacterManager'
import { DishManager } from '../managers/DishManager'
import { GameLoop } from '../core/GameLoop'
import { Station } from '../entities/Station'
import { OrderManager } from '../systems/OrderManager'
import { TutorialManager } from '../tutorial/TutorialManager'
import { setupBasicTutorial } from '../tutorial/steps/TutorialSequence'
import { KitchenLoader } from '../editor/KitchenLoader'
import { PointerController } from '../input/PointerController'
import { InputManager } from '../input/InputManager'
import { KitchenLayout } from '../types/KitchenLayout'
import level1 from '../data/level_1.json'
import { RealtimeManager } from '../network/RealtimeManager'

export class KitchenScene extends Container {
  public characterManager: CharacterManager
  public orderManager: OrderManager
  public dishManager: DishManager
  public stations: Station[] = []
  public realtimeManager: RealtimeManager | null = null

  public tutorialManager: TutorialManager
  private currentLevel: KitchenLayout

  // Interactive background
  private background: Container

  private updateTimer: number = 0

  constructor(roomId: string | null, playerId: string, levelConfig: KitchenLayout | null = null) {
    super()

    // Setup Managers
    this.currentLevel = levelConfig || (level1 as KitchenLayout)
    this.orderManager = new OrderManager()

    // Draw background (Hit Area for Tap-to-Move)
    this.background = this.drawBackground()
    this.addChildAt(this.background, 0)

    this.setupStations()

    this.characterManager = new CharacterManager(this)
    this.dishManager = new DishManager(this)
    this.tutorialManager = new TutorialManager(this)

    // Setup Controls (Tap-to-Move)
    const pointerController = new PointerController(
      this.background,
      this.characterManager,
      playerId
    )
    InputManager.getInstance().addController(pointerController)

    // Initialize Realtime Multiplayer
    if (roomId) {
      this.realtimeManager = new RealtimeManager(roomId, playerId)
      this.realtimeManager.connect()

      this.realtimeManager.onPlayerJoin = (id) => {
        console.log('Remote player joined:', id)
        this.characterManager.spawnRemoteCharacter(id, 400, 600)
      }

      this.realtimeManager.onPlayerStateUpdate = (state) => {
        this.characterManager.updateRemoteCharacter(
          state.id,
          state.x,
          state.y,
          state.vx,
          state.vy,
          state.anim,
          state.flipX
        )
      }

      this.realtimeManager.onPlayerLeave = (id) => {
        console.log('Remote player left:', id)
        this.characterManager.removeCharacter(id)
      }
    }

    this.spawnPlayer(playerId)

    setupBasicTutorial(this.tutorialManager)
    this.tutorialManager.start()

    // Use Ticker to drive the validation
    Ticker.shared.add((ticker: Ticker) => {
      this.tutorialManager.update()
      InputManager.getInstance().update()

      // Broadcast state
      if (this.realtimeManager && this.characterManager) {
        this.updateTimer += ticker.deltaTime
        if (this.updateTimer > 5) {
          const myChar = this.characterManager.getCharacter(playerId)
          if (myChar) {
            this.realtimeManager.broadcastState({
              id: playerId,
              x: myChar.x,
              y: myChar.y,
              vx: myChar.velocity.x,
              vy: myChar.velocity.y,
              anim: myChar.state,
              flipX: myChar.sprite.scale.x < 0,
              timestamp: Date.now(),
            })
          }
          this.updateTimer = 0
        }
      }
    })
  }

  public setupSystems(gameLoop: GameLoop) {
    gameLoop.movementSystem.setManager(this.characterManager)
    gameLoop.actionSystem.setManager(this.characterManager)
  }

  private drawBackground(): Container {
    const bgContainer = new Container()

    // 1. Draw Floor (Image)
    const texture = Texture.from('/assets/backgrounds/bg_level_1.png')
    const bgSprite = new Sprite(texture)

    // Scale to fit or cover the screen area (800x600 for now)
    // Scale to fit or cover the screen area (800x600 for now)
    bgSprite.width = 1200
    bgSprite.height = 800

    bgContainer.addChild(bgSprite)

    return bgContainer
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

  private spawnPlayer(myId: string) {
    // Spawn my character
    this.characterManager.spawnCharacter({
      id: myId,
      name: 'Me',
      startPosition: { x: 400 + Math.random() * 100, y: 600 },
      speed: 250,
      textureId: 'char-boy-1',
      isAI: false,
    })
  }
}
