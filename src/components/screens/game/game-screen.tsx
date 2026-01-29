'use client'

import GameCanvas from '@/components/game/GameCanvas'

interface GameScreenProps {
    roomId?: string | null
    playerId: string
    characterId?: string
}

export function GameScreen({ roomId, playerId, characterId }: GameScreenProps) {
    return (
        <main className="w-full h-screen">
            <GameCanvas roomId={roomId} playerId={playerId} characterId={characterId} />
        </main>
    )
}
