import { GameScreen } from "@/components/screens/game/game-screen";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface GamePageProps {
    params: {
        id: string
    }
}

export default async function GamePage({ params }: GamePageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <GameScreen roomId={params.id} playerId={user.id} />;
}
