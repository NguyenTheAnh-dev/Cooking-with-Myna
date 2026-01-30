import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { PlayerState } from './types'

export class RealtimeManager {
  private supabase: SupabaseClient
  private channel: RealtimeChannel | null = null
  private roomId: string
  private playerId: string

  // Callbacks
  public onPlayerStateUpdate: ((state: PlayerState) => void) | null = null
  public onPlayerJoin: ((id: string) => void) | null = null
  public onPlayerLeave: ((id: string) => void) | null = null
  public onGameEvent: ((type: string, payload: unknown) => void) | null = null
  public onPresenceSync: (() => void) | null = null

  constructor(roomId: string, playerId: string) {
    this.roomId = roomId
    this.playerId = playerId
    this.supabase = createClient()
  }

  public connect() {
    this.channel = this.supabase.channel(`room:${this.roomId}`)

    this.channel
      .on('presence', { event: 'sync' }, () => {
        const newState = this.channel?.presenceState()
        console.log('Presence sync:', newState)
        if (this.onPresenceSync) this.onPresenceSync()
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Player joined:', key, newPresences)
        if (key !== this.playerId && this.onPlayerJoin) {
          this.onPlayerJoin(key)
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Player left:', key, leftPresences)
        if (key !== this.playerId && this.onPlayerLeave) {
          this.onPlayerLeave(key)
        }
      })
      .on('broadcast', { event: 'player_state' }, ({ payload }) => {
        if (payload.id !== this.playerId && this.onPlayerStateUpdate) {
          this.onPlayerStateUpdate(payload as PlayerState)
        }
      })
      .on('broadcast', { event: 'game_event' }, ({ payload }) => {
        if (this.onGameEvent) {
          this.onGameEvent(payload.type, payload.data)
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel?.track({
            id: this.playerId,
            online_at: new Date().toISOString(),
          })
          console.log('Connected to room:', this.roomId)
        }
      })
  }

  public disconnect() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  public broadcastState(state: PlayerState) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'player_state',
      payload: state,
    })
  }

  public broadcastGameEvent(type: string, payload: unknown) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'game_event',
      payload: { type, payload },
    })
  }

  // --- Helpers ---

  public getPlayers(): { id: string; state: unknown }[] {
    if (!this.channel) return []

    // Access internal presence state safely
    const state = this.channel.presenceState()
    const players: { id: string; state: unknown }[] = []

    // Map presence state to a list of players
    for (const key in state) {
      // Each key is a user ID (or internal socket ref), value is array of presences
      const presences = state[key]
      if (presences && presences.length > 0) {
        // We assume 1 presence per user for now
        const userPresence = presences[0] as unknown as { user_id: string; [key: string]: unknown }
        players.push({
          id: userPresence.user_id, // Ensure we track user_id in track()
          state: userPresence,
        })
      }
    }

    return players
  }
}
