import {
  createClient,
  RealtimeChannel,
  SupabaseClient as SupabaseJsClient,
} from '@supabase/supabase-js'
import { RealtimeAdapter } from './RealtimeAdapter'
import { EventBus } from '../core/EventBus'

export class SupabaseClient extends RealtimeAdapter {
  private client: SupabaseJsClient
  private channel: RealtimeChannel | null = null

  constructor(roomId: string) {
    super(roomId)
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  public connect() {
    this.channel = this.client
      .channel(this.roomId)

      ?.on(
        'broadcast',
        { event: 'game-event' },
        ({ payload }: { payload: { internalEvent: string; data: unknown } }) => {
          // payload from supabase is generic, so we cast internal structure or validate it
          EventBus.getInstance().emit(payload.internalEvent, payload.data)
        }
      )
      .subscribe((status: string) => {
        console.log(`[Realtime] Connected to room ${this.roomId}: ${status}`)
      })
  }

  public disconnect() {
    this.channel?.unsubscribe()
  }

  public emit(event: string, payload: unknown) {
    this.channel?.send({
      type: 'broadcast',
      event: 'game-event',
      payload: { internalEvent: event, data: payload },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public on(_event: string, _callback: (payload: unknown) => void) {
    // Implementation would hook into channel or listener map if needed directly
  }
}
