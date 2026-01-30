'use client'

import GameCanvas from '@/components/game/GameCanvas'
import { GameOverlay } from '@/components/game/GameOverlay'

interface GameScreenProps {
    roomId?: string | null
    playerId: string
    characterId?: string
    levelId?: number
}

export function GameScreen({ roomId, playerId, characterId, levelId }: GameScreenProps) {
    return (
        <main className="w-full h-screen relative">
            <GameOverlay />
            <GameCanvas roomId={roomId} playerId={playerId} characterId={characterId} levelId={levelId} />
        </main>
    )
}

