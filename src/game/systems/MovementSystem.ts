import { CharacterManager } from '../managers/CharacterManager'
import { Character } from '../entities/Character'

export class MovementSystem {
  private characterManager: CharacterManager | null = null

  public setManager(manager: CharacterManager) {
    this.characterManager = manager
  }

  public update(dt: number) {
    if (!this.characterManager) return

    const characters = this.characterManager.getAllCharacters()
    characters.forEach((char) => this.updateCharacter(char, dt))
  }

  private updateCharacter(char: Character, dt: number) {
    // If we have a target position, calculate velocity
    if (char.targetPosition) {
      const dx = char.targetPosition.x - char.x
      const dy = char.targetPosition.y - char.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 5) {
        // Arrived
        char.x = char.targetPosition.x
        char.y = char.targetPosition.y
        char.velocity = { x: 0, y: 0 }
        char.targetPosition = null
        if (char.state === 'walk') char.setVisualState('idle')
      } else {
        // Normalize and scale by speed
        char.velocity.x = (dx / dist) * char.speed
        char.velocity.y = (dy / dist) * char.speed

        // Face direction
        if (char.velocity.x > 0) char.setDirection('right')
        if (char.velocity.x < 0) char.setDirection('left')

        char.setVisualState('walk')
      }
    }

    // Apply velocity
    if (char.velocity.x !== 0 || char.velocity.y !== 0) {
      char.x += char.velocity.x * dt
      char.y += char.velocity.y * dt
    }
  }
}
