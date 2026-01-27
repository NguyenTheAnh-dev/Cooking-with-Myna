import { TutorialStep } from '../TutorialStep'
import { StationType } from '../../entities/Station'

export class MoveToStationStep extends TutorialStep {
  private targetStationType: StationType
  private targetId: string | null = null
  private radius: number = 80 // Distance to consider "arrived"

  constructor(id: string, description: string, stationType: StationType) {
    super(id, description)
    this.targetStationType = stationType
  }

  public enter(): void {
    super.enter()
    if (!this.manager) return

    // Find the station
    // Accessing scene via manager
    const stations = this.manager.getScene().stations
    const target = stations.find((s: any) => s.type === this.targetStationType)

    if (target) {
      this.targetId = target.id
      this.manager.highlight(target.x, target.y, 80, 80)
    }
  }

  public update(_dt: number): boolean {
    if (!this.manager || !this.targetId) return false

    // Check player player distance to station
    // Assuming single local player for tutorial or taking the first one
    const player = this.manager.getScene().characterManager.getAllCharacters()[0]
    if (!player) return false

    const stations = this.manager.getScene().stations
    const target = stations.find((s: any) => s.id === this.targetId)
    if (!target) return false

    const dx = player.x - target.x
    const dy = player.y - target.y // Basic distance
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < this.radius) {
      return true
    }

    return false
  }
}
