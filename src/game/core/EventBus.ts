type EventHandler = (payload: unknown) => void

export class EventBus {
  private static instance: EventBus
  private listeners: Map<string, EventHandler[]> = new Map()

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  public on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(handler)
  }

  public off(event: string, handler: EventHandler) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      this.listeners.set(
        event,
        handlers.filter((h) => h !== handler)
      )
    }
  }

  public emit(event: string, payload?: unknown) {
    this.listeners.get(event)?.forEach((handler) => handler(payload))
  }
}
