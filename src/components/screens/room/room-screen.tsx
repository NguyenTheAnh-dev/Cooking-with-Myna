'use client'

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/common/Header"
import { GameContainer } from "@/components/common/GameContainer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Copy, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface RoomScreenProps {
    roomId: string
}

interface Player {
    userId: string
    name: string
    characterId?: string
    isReady?: boolean
    joinedAt: number
}

const AVAILABLE_CHARACTERS = [
    'char-girl-1', 'char-girl-2', 'char-girl-3', 'char-girl-4',
    'char-boy-1', 'char-boy-2', 'char-boy-3', 'char-girl-5'
]

export function RoomScreen({ roomId }: RoomScreenProps) {
    const router = useRouter()
    const [players, setPlayers] = useState<Player[]>([])
    const [myCharacter, setMyCharacter] = useState<string | undefined>(undefined)
    const [userId, setUserId] = useState<string>('')
    const supabase = createClient()

    const myCharacterRef = useRef<string | undefined>(undefined)

    // Sync ref when state changes
    useEffect(() => {
        myCharacterRef.current = myCharacter
    }, [myCharacter])

    useEffect(() => {
        const initLobby = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return // Handle unauth if needed, but middleware likely catches it

            const myId = user.id
            setUserId(myId)

            const channel = supabase.channel(`room:${roomId}`, {
                config: {
                    presence: {
                        key: myId,
                    },
                },
            })

            channel
                .on('presence', { event: 'sync' }, () => {
                    const newState = channel.presenceState()
                    const activePlayers: Player[] = []

                    Object.values(newState).forEach((presences: unknown) => {
                        const presenceList = presences as {
                            userId: string
                            name: string
                            characterId?: string
                            isReady?: boolean
                            online_at?: string
                        }[]
                        presenceList.forEach((presence) => {
                            activePlayers.push({
                                userId: presence.userId,
                                name: presence.name || 'Chef', // Simplified name for now
                                characterId: presence.characterId,
                                isReady: presence.isReady,
                                joinedAt: presence.online_at ? new Date(presence.online_at).getTime() : Date.now()
                            })
                        })
                    })

                    // Sort by join time to keep order stable
                    activePlayers.sort((a, b) => a.joinedAt - b.joinedAt)
                    setPlayers(activePlayers)
                })
                .on('broadcast', { event: 'start_game' }, () => {
                    const charId = myCharacterRef.current
                    if (charId) {
                        router.push(`/game/${roomId}?character=${charId}`)
                    } else {
                        // Fallback or handle error? For now just go without (defaults to boy-1)
                        router.push(`/game/${roomId}`)
                    }
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        // Initial track
                        await channel.track({
                            userId: myId,
                            name: user.email?.split('@')[0] || 'Chef',
                            characterId: undefined, // Start with no character
                            online_at: new Date().toISOString(),
                        })
                    }
                })

            return () => {
                supabase.removeChannel(channel)
            }
        }

        initLobby()
    }, [roomId, supabase, router])

    const handleSelectCharacter = async (charId: string) => {
        // Prevent selecting if taken (unless it's already mine - logic below handles switch)
        if (players.some(p => p.characterId === charId && p.userId !== userId)) return

        setMyCharacter(charId)

        // Update Presence with new character
        const channel = supabase.channel(`room:${roomId}`)
        await channel.track({
            userId: userId,
            name: players.find(p => p.userId === userId)?.name || 'Chef',
            characterId: charId,
            online_at: new Date().toISOString(), // Keep track of original join time if possible, effectively re-tracking updates payload
        })
    }

    const handleStartGame = async () => {
        const channel = supabase.channel(`room:${roomId}`)
        await channel.send({
            type: 'broadcast',
            event: 'start_game',
            payload: {},
        })
        const charId = myCharacterRef.current
        if (charId) {
            router.push(`/game/${roomId}?character=${charId}`)
        }
    }

    // Grid slots (4 max)
    const gridSlots = Array(4).fill(null).map((_, i) => players[i] || null)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <GameContainer className="max-w-6xl flex-1 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">

                    {/* Left Side: Character Selection (Allocated 5 cols) */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        <Card className="flex-1 border-2">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-2xl">
                                    <span>Chọn Nhân Vật</span>
                                    <Badge variant="outline">{myCharacter ? 'Đã chọn' : 'Chưa chọn'}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    {AVAILABLE_CHARACTERS.map((charId) => {
                                        const isTaken = players.some(p => p.characterId === charId && p.userId !== userId)
                                        const isSelected = myCharacter === charId

                                        return (
                                            <button
                                                key={charId}
                                                disabled={isTaken}
                                                onClick={() => handleSelectCharacter(charId)}
                                                className={`
                                                    relative aspect-square rounded-xl overflow-hidden border-4 transition-all
                                                    ${isSelected ? 'border-primary ring-4 ring-primary/20 scale-105 z-10' : 'border-transparent hover:border-primary/50'}
                                                    ${isTaken ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer bg-accent/20'}
                                                `}
                                            >
                                                <Image
                                                    src={`/assets/characters/${charId}.png`}
                                                    alt={charId}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                                {isTaken && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 font-bold text-white text-xs">
                                                        TAKEN
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Room Info Compact */}
                                <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-dashed flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">Room ID:</span>
                                    <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-md border font-mono font-bold text-lg">
                                        {roomId}
                                        <Copy className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Player Grid (Allocated 7 cols) */}
                    <div className="md:col-span-7 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            {gridSlots.map((player, i) => (
                                <Card key={i} className={`
                                    relative flex flex-col items-center justify-center min-h-[200px] border-2 transition-all
                                    ${player ? 'border-primary/50 bg-primary/5' : 'border-dashed border-muted-foreground/20 bg-muted/10'}
                                `}>
                                    {player ? (
                                        <>
                                            <div className="relative w-32 h-32 mb-4">
                                                {player.characterId ? (
                                                    <Image
                                                        src={`/assets/characters/${player.characterId}.png`}
                                                        alt="Character"
                                                        fill
                                                        className="object-contain drop-shadow-xl"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-full animate-pulse">
                                                        <ChefHat className="h-16 w-16 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                {player.userId === userId && (
                                                    <Badge className="absolute -top-2 -right-2">Bạn</Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-primary">{player.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {player.characterId ? 'Sẵn sàng' : 'Đang chọn...'}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="text-center text-muted-foreground/40">
                                            <User className="h-16 w-16 mx-auto mb-2 opacity-20" />
                                            <p className="font-medium">Waiting Player...</p>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        {/* Start Game Button (Full Width) */}
                        <Button
                            size="lg"
                            className="w-full h-16 text-2xl font-bold shadow-lg uppercase tracking-wider"
                            disabled={!myCharacter} // Must select char to start
                            onClick={handleStartGame}
                        >
                            Start Cooking! 🍳
                        </Button>
                    </div>
                </div>
            </GameContainer>
        </div>
    );
}
