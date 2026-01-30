import { Container, Sprite, Texture, Ticker } from 'pixi.js'
import { ParticleManager } from '../managers/ParticleManager'
import { FeedbackManager } from '../managers/FeedbackManager'
import { CharacterManager } from '../managers/CharacterManager'
import { DishManager } from '../managers/DishManager'
import { OrderManager, Order } from '../systems/OrderManager'
import { Station } from '../entities/Station'
import { RealtimeManager } from '../network/RealtimeManager'
import { TutorialManager } from '../tutorial/TutorialManager'
import { KitchenLayout } from '../types/KitchenLayout'
import level1 from '../data/level_1.json'
import { useGameStore } from '../store/gameStore'
import { PointerController } from '../input/PointerController'
import { InputManager } from '../input/InputManager'
import { EventBus } from '../core/EventBus'
import { KitchenLoader } from '../editor/KitchenLoader'
import { GameLoop } from '../core/GameLoop'
import { setupBasicTutorial } from '../tutorial/steps/TutorialSequence'

export class KitchenScene extends Container {
  public characterManager: CharacterManager
  public orderManager: OrderManager
  public dishManager: DishManager
  public particleManager!: ParticleManager
  public feedbackManager!: FeedbackManager
  public stations: Station[] = []
  public realtimeManager: RealtimeManager | null = null
  // public gameHUD: GameHUD  <-- Removed
  // public resultScreen: ResultScreen <-- Removed

  public tutorialManager: TutorialManager
  private currentLevel: KitchenLayout

  // Sync Flag to prevent broadcast loops
  private isProcessingNetworkEvent: boolean = false

  // Interactive background
  private background: Container

  private updateTimer: number = 0
  private timeRemaining: number = 180000 // 3 mins default
  private isGameRunning: boolean = false

  constructor(
    roomId: string | null,
    playerId: string,
    levelConfig: KitchenLayout | null = null,
    characterId?: string
  ) {
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

    this.setupVisuals()

    // Start game logic (Host vs Client logic handled below)
    this.isGameRunning = true
    useGameStore.getState().resetGame()
    useGameStore.getState().setTime(this.timeRemaining)

    // Setup Game Over Trigger (Host)
    // Game Over Logic will be checked in update()

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

      // Host Detection
      this.realtimeManager.onPresenceSync = () => {
        const players = this.realtimeManager!.getPlayers()
        if (players.length > 0) {
          // First player joined is Host
          const isHost = players[0].id === playerId
          if (isHost) {
            console.log('I am the HOST')
            this.orderManager.startGeneration()
          } else {
            console.log('I am a CLIENT')
            this.orderManager.stopGeneration()
          }
        }
      }

      // Game Event Sync (Client Side)
      this.realtimeManager.onGameEvent = (type, payload) => {
        this.isProcessingNetworkEvent = true
        try {
          if (type === 'ORDER_NEW') {
            this.orderManager.addOrder(payload as Order)
            useGameStore.getState().addOrder(payload as Order) // Sync to UI
          } else if (type === 'GAME_OVER') {
            const data = payload as { score: number }
            this.isGameRunning = false
            useGameStore.getState().setGameOver(true)
            useGameStore.getState().setScore(data.score)
            this.orderManager.stopGeneration()
          } else if (type === 'ORDER_COMPLETED') {
            const data = payload as { recipeId: string }
            this.orderManager.completeOrder(data.recipeId)
            // Score update is handled by OrderManager callback or separate event?
            // We need to sync score.
            // For now, let's assume Host broadcasts score update or we calc locally.
          }
        } finally {
          this.isProcessingNetworkEvent = false
        }
      }

      // Broadcast Logic (Host Side)
      const bus = EventBus.getInstance()
      bus.on('ORDER_NEW', (payload) => {
        if (this.isProcessingNetworkEvent) return

        const order = payload as Order
        // Only Host broadcasts new orders they generated
        const players = this.realtimeManager?.getPlayers() || []
        const isHost = players.length > 0 && players[0].id === playerId

        if (isHost) {
          this.realtimeManager?.broadcastGameEvent('ORDER_NEW', order)
        }
      })

      bus.on('ORDER_COMPLETED', (payload: unknown) => {
        if (this.isProcessingNetworkEvent) return
        this.realtimeManager?.broadcastGameEvent('ORDER_COMPLETED', payload)
      })

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

    this.spawnPlayer(playerId, characterId)

    setupBasicTutorial(this.tutorialManager)
    this.tutorialManager.start()

    // Use Ticker to drive the validation
    Ticker.shared.add((ticker: Ticker) => {
      this.particleManager.update(ticker.deltaTime / 60) // ticker.deltaTime is frames, rough approx or we use elapsedMS?
      // Better use elapsedMS/1000 for seconds
      const dt = ticker.elapsedMS / 1000
      this.particleManager.update(dt)
      this.feedbackManager.update(dt)

      this.tutorialManager.update()
      InputManager.getInstance().update()
      this.characterManager.update(dt)

      // Handle Game Timer (Host Logic mostly, but client simulates too)
      if (this.isGameRunning) {
        this.timeRemaining -= ticker.elapsedMS
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0
          this.isGameRunning = false

          // Host triggers Game Over
          if (
            this.realtimeManager &&
            this.realtimeManager.getPlayers().length > 0 &&
            this.realtimeManager.getPlayers()[0].id === playerId
          ) {
            const currentScore = useGameStore.getState().score
            this.realtimeManager.broadcastGameEvent('GAME_OVER', { score: currentScore })
            useGameStore.getState().setGameOver(true)
          }
        }
        // Sync Time to Store (throttled slightly if performance issue, but 60fps React update is fine for simple overlay)
        useGameStore.getState().setTime(this.timeRemaining)
      }

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

  private setupVisuals() {
    this.particleManager = new ParticleManager()
    this.feedbackManager = new FeedbackManager()

    // Add to scene - Ensure particles are below characters but feedback is on top
    this.addChildAt(this.particleManager, 1) // Above background
    this.addChild(this.feedbackManager) // On top of everything

    // Setup Event Listeners
    const bus = EventBus.getInstance()

    bus.on('ORDER_COMPLETED', () => {
      // Find where to spawn? Maybe center screen or generic
      this.feedbackManager.spawnFloatingText('+100', 600, 100, '#ffff00')
      this.particleManager.spawn('sparkle', 600, 100, 10)
    })

    bus.on('STATION_COOKING_TICK', (payload: unknown) => {
      const p = payload as { x: number; y: number }
      // payload: { stationId, stationX, stationY }
      if (Math.random() < 0.1) {
        // 10% chance per tick to spawn smoke
        this.particleManager.spawn('smoke', p.x, p.y - 40, 1)
      }
    })

    bus.on('STATION_BURNT', (payload: unknown) => {
      const p = payload as { x: number; y: number }
      this.particleManager.spawn('fire', p.x, p.y - 40, 5)
      this.feedbackManager.spawnFloatingText('BURNT!', p.x, p.y - 60, '#ff0000')
    })
  }

  public setupSystems(gameLoop: GameLoop) {
    gameLoop.movementSystem.setManager(this.characterManager)
    gameLoop.actionSystem.setManager(this.characterManager)
  }

  private drawBackground(): Container {
    const bgContainer = new Container()

    // 1. Draw Floor (Image)
    const texture = Texture.from('/backgrounds/bg_level_1.png')
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

  private spawnPlayer(myId: string, characterId?: string) {
    // Spawn my character
    this.characterManager.spawnCharacter({
      id: myId,
      name: 'Me',
      startPosition: { x: 400 + Math.random() * 100, y: 600 },
      speed: 250,
      textureId: characterId || 'char-boy-1',
      isAI: false,
    })
  }
}
