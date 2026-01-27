export abstract class RealtimeAdapter {
  protected roomId: string

  constructor(roomId: string) {
    this.roomId = roomId
  }

  abstract connect(): void
  abstract disconnect(): void
  abstract emit(event: string, payload: unknown): void
  abstract on(event: string, callback: (payload: unknown) => void): void
}
