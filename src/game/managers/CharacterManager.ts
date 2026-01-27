import { Container } from 'pixi.js'
import { Character } from '../entities/Character'
import { AINPC } from '../entities/AINPC'
import { CharacterConfig } from '../models/GameState'
import { KitchenScene } from '../scenes/KitchenScene'

export class CharacterManager {
  public container: Container
  private characters: Map<string, Character> = new Map()
  private scene: KitchenScene

  constructor(scene: KitchenScene) {
    this.scene = scene
    this.container = new Container()
    this.container.label = 'CharacterLayer'
    this.container.sortableChildren = true
    scene.addChild(this.container)
  }

  public spawnCharacter(config: CharacterConfig) {
    if (this.characters.has(config.id)) return

    let char: Character

    if (config.isAI) {
      char = new AINPC(config.id, config.textureId, this.scene)
    } else {
      char = new Character(config.id, config.textureId, config.speed)
    }

    char.x = config.startPosition.x
    char.y = config.startPosition.y
    if (config.speed) char.speed = config.speed

    this.container.addChild(char)
    this.characters.set(config.id, char)
  }

  public getCharacter(id: string): Character | undefined {
    return this.characters.get(id)
  }

  public getAllCharacters(): Character[] {
    return Array.from(this.characters.values())
  }

  public update(dt: number) {
    // Update AIs
    this.characters.forEach((char) => {
      if (char instanceof AINPC) {
        char.update(dt)
      }
    })

    this.container.children.sort((a, b) => a.y - b.y)
  }
}
