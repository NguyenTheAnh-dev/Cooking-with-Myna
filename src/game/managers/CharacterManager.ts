import { Container } from 'pixi.js'
import { Character } from '../entities/Character'
import { CharacterConfig } from '../models/GameState'

export class CharacterManager {
  public container: Container
  private characters: Map<string, Character> = new Map()

  constructor(parentContainer: Container) {
    this.container = new Container()
    this.container.label = 'CharacterLayer'
    this.container.sortableChildren = true
    parentContainer.addChild(this.container)
  }

  public spawnCharacter(config: CharacterConfig) {
    if (this.characters.has(config.id)) return

    const char = new Character(config.id, config.textureId, config.speed)
    char.x = config.startPosition.x
    char.y = config.startPosition.y

    this.container.addChild(char)
    this.characters.set(config.id, char)
  }

  public getCharacter(id: string): Character | undefined {
    return this.characters.get(id)
  }

  public getAllCharacters(): Character[] {
    return Array.from(this.characters.values())
  }

  public update() {
    this.container.children.sort((a, b) => a.y - b.y)
  }
}
