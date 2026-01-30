import { GameScreen } from "@/components/screens/game/game-screen";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface GamePageProps {
    params: Promise<{
        id: string
    }>
    searchParams: Promise<{
        character?: string
        level?: string
        players?: string
    }>
}

interface PlayerData {
    id: string
    characterId?: string
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const levelId = resolvedSearchParams.level ? parseInt(resolvedSearchParams.level) : 1;

    // Parse players data for multiplayer sync
    let playersData: PlayerData[] = []
    if (resolvedSearchParams.players) {
        try {
            playersData = JSON.parse(resolvedSearchParams.players)
        } catch {
            playersData = []
        }
    }

    return <GameScreen
        roomId={resolvedParams.id}
        playerId={user.id}
        characterId={resolvedSearchParams.character}
        levelId={levelId}
        players={playersData}
    />;
}


