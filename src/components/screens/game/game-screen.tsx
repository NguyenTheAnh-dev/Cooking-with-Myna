'use client'

import GameCanvas from '@/components/game/GameCanvas'
import { GameOverlay } from '@/components/game/GameOverlay'

interface GameScreenProps {
    roomId?: string | null
    playerId: string
    characterId?: string
}

export function GameScreen({ roomId, playerId, characterId }: GameScreenProps) {
    return (
        <main className="w-full h-screen relative">
            <GameOverlay />
            <GameCanvas roomId={roomId} playerId={playerId} characterId={characterId} />
        </main>
    )
}
