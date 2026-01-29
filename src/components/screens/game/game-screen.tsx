'use client'

import GameCanvas from '@/components/game/GameCanvas'

interface GameScreenProps {
    roomId?: string | null
}

export function GameScreen({ roomId }: GameScreenProps) {
    return (
        <main className="w-full h-screen">
            <GameCanvas roomId={roomId} />
        </main>
    )
}
