import { TutorialStep } from '../TutorialStep'
import { EventBus } from '../../core/EventBus'

export class InteractionStep extends TutorialStep {
  private eventName: string
  private triggered: boolean = false
  private cleanup: (() => void) | null = null

  constructor(id: string, description: string, completionEvent: string) {
    super(id, description)
    this.eventName = completionEvent
  }

  public enter(): void {
    super.enter()
    const eb = EventBus.getInstance()

    const handler = () => {
      this.triggered = true
    }

    eb.on(this.eventName, handler)
    this.cleanup = () => eb.off(this.eventName, handler)
  }

  public update(): boolean {
    return this.triggered
  }

  public exit(): void {
    super.exit()
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }
  }
}
