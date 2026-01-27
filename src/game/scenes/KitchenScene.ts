import { Container, Graphics } from 'pixi.js'
import { CharacterManager } from '../managers/CharacterManager'
import { GameLoop } from '../core/GameLoop'
import { Station } from '../entities/Station'
import { EventBus } from '../core/EventBus'

export class KitchenScene extends Container {
  private characterManager: CharacterManager
  private stations: Station[] = []

  constructor() {
    super()

    // 1. Setup Background & Stations
    this.drawBackground()
    this.setupStations()

    // 2. Setup Managers
    this.characterManager = new CharacterManager(this)

    // 3. Spawn Initial Characters
    this.spawnInitialCharacters()

    // 4. Start Demo Flow
    this.startDemoSimulation()
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

  private spawnInitialCharacters() {
    // Spawn 8 chars
    const ids = ['boy-1', 'boy-2', 'boy-3', 'girl-1', 'girl-2', 'girl-3', 'girl-4', 'girl-5']
    const avatars = [
      'char-boy-1',
      'char-boy-2',
      'char-boy-3',
      'char-girl-1',
      'char-girl-2',
      'char-girl-3',
      'char-girl-4',
      'char-girl-5',
    ]

    ids.forEach((id, i) => {
      this.characterManager.spawnCharacter({
        id,
        name: id,
        startPosition: { x: 100 + i * 100, y: 700 - (i % 2) * 50 },
        speed: 150 + Math.random() * 50,
        textureId: avatars[i],
      })
    })
  }

  private startDemoSimulation() {
    // Simulate inputs via EventBus to test ActionSystem
    setInterval(() => {
      const chars = this.characterManager.getAllCharacters()
      const randomChar = chars[Math.floor(Math.random() * chars.length)]
      const randomStation = this.stations[Math.floor(Math.random() * this.stations.length)]

      if (randomChar && randomStation) {
        // Dispatch MOVE event
        EventBus.getInstance().emit('PLAYER_MOVE', {
          characterId: randomChar.id,
          x: randomStation.x,
          y: randomStation.y + 60, // Stand in front
        })
      }
    }, 2000)
  }
}
