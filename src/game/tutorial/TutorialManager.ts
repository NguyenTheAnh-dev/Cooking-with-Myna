import { TutorialStep } from './TutorialStep'
import { TutorialOverlay } from './TutorialOverlay'
import type { KitchenScene } from '../scenes/KitchenScene'

export class TutorialManager {
  public overlay: TutorialOverlay
  private steps: TutorialStep[] = []
  private currentStepIndex: number = -1
  private scene: KitchenScene
  private isActive: boolean = false

  constructor(scene: KitchenScene) {
    this.scene = scene
    this.overlay = new TutorialOverlay()

    // Attach overlay to scene (top layer)
    this.scene.addChild(this.overlay)
  }

  public addStep(step: TutorialStep) {
    step.setManager(this)
    this.steps.push(step)
  }

  public start() {
    if (this.steps.length === 0) return
    this.isActive = true
    this.currentStepIndex = 0
    this.startCurrentStep()
  }

  public stop() {
    this.isActive = false
    this.overlay.hide()
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
      this.steps[this.currentStepIndex].exit()
    }
  }

  public update() {
    if (!this.isActive) return

    const currentStep = this.steps[this.currentStepIndex]
    if (currentStep) {
      const completed = currentStep.update()
      if (completed) {
        this.advanceStep()
      }
    }
  }

  public getScene(): KitchenScene {
    return this.scene
  }

  public showMessage(msg: string) {
    this.overlay.show(msg)
  }

  public highlight(x: number, y: number, w: number, h: number) {
    this.overlay.highlightArea(x, y, w, h)
  }

  private startCurrentStep() {
    const step = this.steps[this.currentStepIndex]
    if (step) {
      step.enter()
      this.overlay.show(step.description)
    } else {
      // Finished
      this.stop()
    }
  }

  private advanceStep() {
    const step = this.steps[this.currentStepIndex]
    step.exit()

    this.currentStepIndex++
    this.startCurrentStep()
  }
}
