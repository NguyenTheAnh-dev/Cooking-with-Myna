import { RoomScreen } from "@/components/screens/room/room-screen";

interface RoomPageProps {
    params: {
        id: string
    }
}

export default function RoomPage({ params }: RoomPageProps) {
    const roomId = params.id ? params.id.toUpperCase() : 'UNKNOWN'

    return <RoomScreen roomId={roomId} />;
}

