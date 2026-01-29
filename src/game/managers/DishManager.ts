import { Container } from 'pixi.js'
import { Plate, PlateState } from '../entities/Plate'
import { EventBus } from '../core/EventBus'

interface DishReturnPoint {
  x: number
  y: number
}

export class DishManager {
  private plates: Map<string, Plate> = new Map()
  private cleanPlateStack: Plate[] = []
  private dirtyPlateStack: Plate[] = []
  private container: Container
  private plateIdCounter = 0

  // Where dirty dishes appear after serving
  private returnPoint: DishReturnPoint = { x: 100, y: 100 }

  // Where clean plates are stored
  private plateStationPosition = { x: 200, y: 100 }

  constructor(container: Container) {
    this.container = container
    this.setupEventListeners()

    // Initialize with some clean plates
    this.initializePlates(6)
  }

  private setupEventListeners() {
    const eventBus = EventBus.getInstance()

    // When order is served, spawn dirty dish
    eventBus.on('ORDER_SERVED', () => {
      this.spawnDirtyPlate()
    })
  }

  private initializePlates(count: number) {
    for (let i = 0; i < count; i++) {
      const plate = this.createPlate('clean')
      this.cleanPlateStack.push(plate)
      // Stack clean plates visually
      plate.x = this.plateStationPosition.x
      plate.y = this.plateStationPosition.y - i * 3
      plate.visible = true
    }
  }

  private createPlate(state: PlateState = 'clean'): Plate {
    const id = `plate-${++this.plateIdCounter}`
    const plate = new Plate(id, state)
    this.plates.set(id, plate)
    this.container.addChild(plate)
    return plate
  }

  public setReturnPoint(x: number, y: number) {
    this.returnPoint = { x, y }
  }

  public setPlateStationPosition(x: number, y: number) {
    this.plateStationPosition = { x, y }
  }

  /**
   * Get a clean plate for plating food
   */
  public getCleanPlate(): Plate | null {
    const plate = this.cleanPlateStack.pop()
    if (plate) {
      EventBus.getInstance().emit('PLATE_TAKEN', { plateId: plate.id })
      return plate
    }
    return null
  }

  /**
   * Check if clean plates are available
   */
  public hasCleanPlates(): boolean {
    return this.cleanPlateStack.length > 0
  }

  public getCleanPlateCount(): number {
    return this.cleanPlateStack.length
  }

  public getDirtyPlateCount(): number {
    return this.dirtyPlateStack.length
  }

  /**
   * Spawn dirty plate at return point (after serving)
   */
  public spawnDirtyPlate() {
    const plate = this.createPlate('dirty')
    plate.x = this.returnPoint.x + this.dirtyPlateStack.length * 5
    plate.y = this.returnPoint.y
    this.dirtyPlateStack.push(plate)

    EventBus.getInstance().emit('DIRTY_PLATE_SPAWNED', { plateId: plate.id })
    console.log(`[DishManager] Dirty plate spawned. Total dirty: ${this.dirtyPlateStack.length}`)
  }

  /**
   * Pick up a dirty plate for washing
   */
  public pickupDirtyPlate(): Plate | null {
    const plate = this.dirtyPlateStack.pop()
    if (plate) {
      EventBus.getInstance().emit('DIRTY_PLATE_PICKED', { plateId: plate.id })
      return plate
    }
    return null
  }

  /**
   * Return washed plate to clean stack
   */
  public returnCleanPlate(plate: Plate) {
    if (plate.state !== 'clean') {
      console.warn('[DishManager] Attempted to return non-clean plate')
      return
    }

    plate.x = this.plateStationPosition.x
    plate.y = this.plateStationPosition.y - this.cleanPlateStack.length * 3
    this.cleanPlateStack.push(plate)

    EventBus.getInstance().emit('PLATE_RETURNED', { plateId: plate.id })
    console.log(`[DishManager] Clean plate returned. Total clean: ${this.cleanPlateStack.length}`)
  }

  public getPlate(id: string): Plate | null {
    return this.plates.get(id) ?? null
  }

  public update() {
    // Update any animations or visual states
    // Plates in washing state are updated by the character holding them
  }
}
