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
  public onGameEvent: ((type: string, payload: any) => void) | null = null
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

  public broadcastGameEvent(type: string, data: any) {
    if (!this.channel) return

    this.channel.send({
      type: 'broadcast',
      event: 'game_event',
      payload: { type, data },
    })
  }

  public getPlayers() {
    if (!this.channel) return []
    const state = this.channel.presenceState()
    const players: any[] = []
    Object.values(state).forEach((presences: any) => {
      presences.forEach((p: any) => players.push(p))
    })
    // Sort by join time
    return players.sort((a, b) => {
      const timeA = a.online_at ? new Date(a.online_at).getTime() : 0
      const timeB = b.online_at ? new Date(b.online_at).getTime() : 0
      return timeA - timeB
    })
  }
}
