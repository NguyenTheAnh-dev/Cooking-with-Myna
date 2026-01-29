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

  public spawnRemoteCharacter(id: string, x: number, y: number, textureId: string = 'char-girl-1') {
    if (this.characters.has(id)) return

    const char = new Character(id, textureId, 250)
    char.x = x
    char.y = y

    // Mark as remote if possible, or just treat as normal character
    // We might need to store target position for interpolation
    char.targetX = x
    char.targetY = y

    this.container.addChild(char)
    this.characters.set(id, char)
  }

  public removeCharacter(id: string) {
    const char = this.characters.get(id)
    if (char) {
      this.container.removeChild(char)
      this.characters.delete(id)
    }
  }

  public updateRemoteCharacter(
    id: string,
    x: number,
    y: number,
    vx: number,
    vy: number,
    anim: string,
    flipX: boolean
  ) {
    const char = this.characters.get(id)
    if (!char) return

    // Update target for interpolation
    char.targetX = x
    char.targetY = y

    // Update velocity and animation immediately for visual feedback
    char.velocity.x = vx
    char.velocity.y = vy

    if (vx !== 0 || vy !== 0) {
      char.playAnimation(anim || 'walk')
    } else {
      char.playAnimation('idle')
    }

    // Direct flip update
    const sprite = char.sprite
    if (sprite && sprite.scale) {
      const scaleX = Math.abs(sprite.scale.x)
      if (flipX) sprite.scale.x = -scaleX
      else sprite.scale.x = scaleX
    }
  }

  public update(dt: number) {
    // Update AIs
    this.characters.forEach((char) => {
      if (char instanceof AINPC) {
        char.update(dt)
      } else {
        // Interpolate remote characters
        const targetX = char.targetX
        const targetY = char.targetY

        if (targetX !== undefined && targetY !== undefined) {
          const t = Math.min(dt * 10, 1) // Lerp factor
          char.x += (targetX - char.x) * t
          char.y += (targetY - char.y) * t

          // Snap if close enough
          if (Math.abs(char.x - targetX) < 1) char.x = targetX
          if (Math.abs(char.y - targetY) < 1) char.y = targetY
        }

        char.update(dt)
      }
    })

    this.container.children.sort((a, b) => a.y - b.y)
  }
}
