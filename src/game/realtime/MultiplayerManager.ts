import { EventBus } from '../core/EventBus'
import { SupabaseClient } from './SupabaseClient'
import { CharacterManager } from '../managers/CharacterManager'

export interface PlayerState {
  id: string
  x: number
  y: number
  direction: 'left' | 'right'
  state: 'idle' | 'walk' | 'cook'
  holdingItem: string | null
}

export interface GameStateSync {
  players: PlayerState[]
  orders: string[] // Order IDs
  score: number
  timeRemaining: number
}

export class MultiplayerManager {
  private client: SupabaseClient
  private localPlayerId: string
  private characterManager: CharacterManager | null = null
  private isHost: boolean = false
  private syncInterval: number = 50 // ms between position syncs
  private lastSyncTime: number = 0

  constructor(roomId: string, playerId: string, isHost: boolean = false) {
    this.client = new SupabaseClient(roomId)
    this.localPlayerId = playerId
    this.isHost = isHost

    this.setupEventListeners()
  }

  public setCharacterManager(manager: CharacterManager) {
    this.characterManager = manager
  }

  public connect() {
    this.client.connect()

    // Announce join
    this.client.emit('PLAYER_JOINED', {
      playerId: this.localPlayerId,
      timestamp: Date.now(),
    })
  }

  public disconnect() {
    this.client.emit('PLAYER_LEFT', {
      playerId: this.localPlayerId,
    })
    this.client.disconnect()
  }

  private setupEventListeners() {
    const bus = EventBus.getInstance()

    // Listen for local player movement to broadcast
    bus.on('LOCAL_PLAYER_MOVE', (payload) => {
      const data = payload as { x: number; y: number; direction: string; state: string }
      this.broadcastPosition(data.x, data.y, data.direction as 'left' | 'right', data.state)
    })

    // Listen for local player actions to broadcast
    bus.on('LOCAL_PLAYER_ACTION', (payload) => {
      const data = payload as { action: string; targetId: string }
      this.broadcastAction(data.action, data.targetId)
    })

    // Listen for incoming remote events
    bus.on('REMOTE_PLAYER_MOVE', (payload) => {
      this.handleRemoteMove(payload as PlayerState)
    })

    bus.on('REMOTE_PLAYER_ACTION', (payload) => {
      this.handleRemoteAction(payload as { playerId: string; action: string; targetId: string })
    })

    bus.on('PLAYER_JOINED', (payload) => {
      this.handlePlayerJoined(payload as { playerId: string })
    })

    bus.on('PLAYER_LEFT', (payload) => {
      this.handlePlayerLeft(payload as { playerId: string })
    })
  }

  public update(dt: number) {
    this.lastSyncTime += dt

    // Periodic position sync
    if (this.lastSyncTime >= this.syncInterval) {
      this.lastSyncTime = 0
      this.syncLocalPlayer()
    }
  }

  private syncLocalPlayer() {
    if (!this.characterManager) return

    const localPlayer = this.characterManager.getCharacter(this.localPlayerId)
    if (!localPlayer) return

    this.broadcastPosition(localPlayer.x, localPlayer.y, localPlayer.direction, localPlayer.state)
  }

  private broadcastPosition(x: number, y: number, direction: 'left' | 'right', state: string) {
    this.client.emit('PLAYER_MOVE', {
      playerId: this.localPlayerId,
      x,
      y,
      direction,
      state,
      timestamp: Date.now(),
    })
  }

  private broadcastAction(action: string, targetId: string) {
    this.client.emit('PLAYER_ACTION', {
      playerId: this.localPlayerId,
      action,
      targetId,
      timestamp: Date.now(),
    })
  }

  private handleRemoteMove(state: PlayerState) {
    if (state.id === this.localPlayerId) return // Ignore own events

    if (!this.characterManager) return

    const remotePlayer = this.characterManager.getCharacter(state.id)
    if (remotePlayer) {
      // Interpolate to position
      remotePlayer.targetPosition = { x: state.x, y: state.y }
      remotePlayer.direction = state.direction
      remotePlayer.setVisualState(state.state)
    }
  }

  private handleRemoteAction(data: { playerId: string; action: string; targetId: string }) {
    if (data.playerId === this.localPlayerId) return

    // Emit local event to trigger action
    EventBus.getInstance().emit('PLAYER_ACTION', {
      characterId: data.playerId,
      action: data.action,
      targetId: data.targetId,
    })
  }

  private handlePlayerJoined(data: { playerId: string }) {
    if (data.playerId === this.localPlayerId) return

    console.log(`[Multiplayer] Player joined: ${data.playerId}`)

    // Create remote player character
    this.characterManager?.spawnCharacter({
      id: data.playerId,
      name: `Player ${data.playerId}`,
      textureId: 'chef-blue',
      startPosition: { x: 400, y: 400 },
    })

    // If host, send current game state
    if (this.isHost) {
      this.sendGameStateToNewPlayer(data.playerId)
    }
  }

  private handlePlayerLeft(data: { playerId: string }) {
    console.log(`[Multiplayer] Player left: ${data.playerId}`)
    // Remove player character
    // Note: CharacterManager would need a removeCharacter method
  }

  private sendGameStateToNewPlayer(_playerId: string) {
    // Host broadcasts full game state for new player to sync
    // This would include all player positions, orders, score, etc.
    const state: GameStateSync = {
      players: [],
      orders: [],
      score: 0,
      timeRemaining: 0,
    }

    this.client.emit('GAME_STATE_SYNC', state)
  }

  public getLocalPlayerId(): string {
    return this.localPlayerId
  }

  public isGameHost(): boolean {
    return this.isHost
  }
}
