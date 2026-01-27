import { TutorialManager } from './TutorialManager'

export abstract class TutorialStep {
  public id: string
  public description: string
  protected manager: TutorialManager | null = null

  constructor(id: string, description: string) {
    this.id = id
    this.description = description
  }

  public setManager(manager: TutorialManager) {
    this.manager = manager
  }

  // Called when step starts
  public enter(): void {
    console.log(`[Tutorial] Starting step: ${this.id}`)
  }

  // Called every frame. Return true if step is complete.
  public update(_dt: number): boolean {
    return false
  }

  // Called when step ends
  public exit(): void {
    console.log(`[Tutorial] Completed step: ${this.id}`)
  }
}
