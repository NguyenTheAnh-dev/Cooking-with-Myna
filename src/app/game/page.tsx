import { GameScreen } from '@/components/screens/game/game-screen'

interface GamePageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function GamePage({ searchParams }: GamePageProps) {
    const roomId = typeof searchParams.roomId === 'string' ? searchParams.roomId : undefined
    return <GameScreen roomId={roomId} />
}

