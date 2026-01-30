'use client'

import GameCanvas from '@/components/game/GameCanvas'
import { GameOverlay } from '@/components/game/GameOverlay'

interface PlayerData {
  id: string
  characterId?: string
}

interface GameScreenProps {
  roomId?: string | null
  playerId: string
  characterId?: string
  levelId?: number
  players?: PlayerData[]
}

export function GameScreen({ roomId, playerId, characterId, levelId, players }: GameScreenProps) {
  return (
    <main className="w-full h-screen relative">
      <GameOverlay />
      <GameCanvas
        roomId={roomId}
        playerId={playerId}
        characterId={characterId}
        levelId={levelId}
        players={players}
      />
    </main>
  )
}
