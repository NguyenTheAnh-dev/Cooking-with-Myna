'use client'

import GameCanvas from '@/components/game/GameCanvas'

interface GameScreenProps {
    roomId?: string | null
    playerId: string
}

export function GameScreen({ roomId, playerId }: GameScreenProps) {
    return (
        <main className="w-full h-screen">
            <GameCanvas roomId={roomId} playerId={playerId} />
        </main>
    )
}
