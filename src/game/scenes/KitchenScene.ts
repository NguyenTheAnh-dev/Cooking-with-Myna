import { Container, Graphics, Ticker } from 'pixi.js'
import { CharacterManager } from '../managers/CharacterManager'
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
  public stations: Station[] = []

  public tutorialManager: TutorialManager
  private currentLevel: KitchenLayout
  // UI Layer
  private hudLayer: MobileHUD

  constructor(levelConfig: KitchenLayout | null = null) {
    super()

    // Setup Inputs
    InputManager.getInstance().addController(new KeyboardController())

    // Default to level 1 if no config passed
    this.currentLevel = levelConfig || (level1 as KitchenLayout)

    // 0. Setup Logic Systems
    this.orderManager = new OrderManager()

    // 1. Setup Background & Stations
    this.drawBackground()
    this.setupStations()

    // 2. Setup Managers
    this.characterManager = new CharacterManager(this)
    this.tutorialManager = new TutorialManager(this)

    // 3. Spawn Initial Characters
    // this.spawnInitialCharacters() // Disable AI for tutorial demo
    this.spawnPlayer()

    // 4. Start Tutorial Demo Flow
    setupBasicTutorial(this.tutorialManager)
    this.tutorialManager.start()

    // 5. Update Loop for Tutorial (UI/Logic)
    Ticker.shared.add((ticker) => {
      this.tutorialManager.update(ticker.deltaTime / 60)
      InputManager.getInstance().update()
    })

    // 6. Mobile HUD
    this.hudLayer = new MobileHUD()
    this.addChild(this.hudLayer)
  }

  public setupSystems(gameLoop: GameLoop) {
    // Inject dependencies into systems
    gameLoop.movementSystem.setManager(this.characterManager)
    gameLoop.actionSystem.setManager(this.characterManager)
  }

  private drawBackground() {
    const floor = new Graphics()
    floor.rect(0, 0, 1200, 800)
    floor.fill(0xececec)
    this.addChild(floor)
  }

  private setupStations() {
    // Load Level from config
    const levelData = this.currentLevel

    // KitchenLoader returns "any[]" of created entities.
    // We assume they are stations for now based on our simple schema.
    const entities = KitchenLoader.load(this, levelData)

    entities.forEach((e) => {
      if (e instanceof Station) {
        this.stations.push(e)
      }
    })
  }

  private spawnPlayer() {
    // Spawn players based on config (hardcoded to 2 for now as requested)
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

  /*
  private spawnInitialCharacters() {
    // Spawn AI NPCs
    const ids = ['ai-chef-1', 'ai-chef-2']
    const avatars = ['char-boy-1', 'char-girl-1']

    ids.forEach((id, i) => {
      this.characterManager.spawnCharacter({
        id,
        name: id,
        startPosition: { x: 100 + i * 100, y: 600 },
        speed: 200,
        textureId: avatars[i],
        isAI: true,
      })
    })
  }
  */
}
