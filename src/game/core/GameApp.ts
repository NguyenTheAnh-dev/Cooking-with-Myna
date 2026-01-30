import { Application } from 'pixi.js'
import { KitchenScene } from '../scenes/KitchenScene'
import { GameLoop } from './GameLoop'
import { LevelSystem } from '../systems/LevelSystem'

interface PlayerData {
  id: string
  characterId?: string
}

export class GameApp {
  private static instance: GameApp
  private app: Application
  private gameLoop: GameLoop
  private scene: KitchenScene | null = null

  private constructor() {
    this.app = new Application()
    this.gameLoop = new GameLoop()
  }

  public static getInstance(): GameApp {
    if (!GameApp.instance) {
      GameApp.instance = new GameApp()
    }
    return GameApp.instance
  }

  public async initialize(
    container: HTMLElement,
    roomId: string | null = null,
    playerId: string = 'local-player',
    characterId?: string,
    levelId: number = 1,
    players: PlayerData[] = []
  ) {
    await this.app.init({
      width: 1200,
      height: 800,
      backgroundColor: 0x1a1a2e,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    container.appendChild(this.app.canvas)

    // Get level config from LevelSystem
    const levelConfig = LevelSystem.getLevelConfig(levelId)
    LevelSystem.setCurrentLevel(levelId)
    console.log(`[GameApp] Loading level ${levelId}: ${levelConfig.name}`)

    // Load scene with level config and player data
    this.scene = new KitchenScene(roomId, playerId, levelId, characterId, players)
    this.app.stage.addChild(this.scene)
    this.scene.setupSystems(this.gameLoop)

    this.gameLoop.start()
  }

  public destroy() {
    this.gameLoop.stop()
    this.app.destroy(true, { children: true })
  }

  public getApp(): Application {
    return this.app
  }

  public getScene(): KitchenScene | null {
    return this.scene
  }
}
