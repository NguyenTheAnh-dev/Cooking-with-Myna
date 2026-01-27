import { Container, Graphics, Ticker } from 'pixi.js'
import { CharacterManager } from '../managers/CharacterManager'
import { GameLoop } from '../core/GameLoop'
import { Station } from '../entities/Station'
import { OrderManager } from '../systems/OrderManager'
import { TutorialManager } from '../tutorial/TutorialManager'
import { setupBasicTutorial } from '../tutorial/steps/TutorialSequence'

export class KitchenScene extends Container {
  public characterManager: CharacterManager
  public orderManager: OrderManager
  public stations: Station[] = []

  public tutorialManager: TutorialManager

  constructor() {
    super()

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
    })
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
    // Define layout
    const layout = [
      { id: 'stove-1', type: 'stove', x: 200, y: 200 },
      { id: 'stove-2', type: 'stove', x: 500, y: 200 },
      { id: 'cut-1', type: 'cut', x: 800, y: 200 },
      { id: 'sink-1', type: 'sink', x: 200, y: 500 },
      { id: 'plate-1', type: 'plate', x: 500, y: 500 },
      { id: 'serve-1', type: 'serve', x: 800, y: 500 },
    ] as const

    layout.forEach((cfg) => {
      const station = new Station(cfg.id, cfg.type, cfg.x, cfg.y)
      this.stations.push(station)
      this.addChild(station)
    })
  }

  private spawnPlayer() {
    // Spawn local player for tutorial
    this.characterManager.spawnCharacter({
      id: 'player-1',
      name: 'You',
      startPosition: { x: 600, y: 600 },
      speed: 250,
      textureId: 'char-boy-1',
      isAI: false,
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
