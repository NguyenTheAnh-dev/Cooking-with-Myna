import { Station } from '../entities/Station'

export class CookingSystem {
  // In a real implementation, we would track active cooking processes
  // For now, we simulate cooking progress on occupied stations

  public update(_dt: number) {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    // 1. Iterate over stations (need access to stations, so we'd inject StationManager or access via Scene if available)
    // For this ECS-lite, we assume entities are managed or we query them.
    // To keep it simple for the prototype, we won't implement full tick-based cooking yet.
    // Instead we rely on EventBus / Actions to trigger state changes instantly.
  }
}
