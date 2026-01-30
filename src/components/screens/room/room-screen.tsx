'use client'

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/common/Header"
import { GameContainer } from "@/components/common/GameContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Copy, User, Lock, Star } from "lucide-react"
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

// Level configurations for UI (simplified from LevelSystem)
const LEVELS = [
    { id: 1, name: 'Starter Kitchen', difficulty: 'easy', unlockScore: 0 },
    { id: 2, name: 'Home Kitchen', difficulty: 'easy', unlockScore: 0 },
    { id: 3, name: 'Cozy Cafe', difficulty: 'easy', unlockScore: 0 },
    { id: 4, name: 'Busy Bistro', difficulty: 'medium', unlockScore: 500 },
    { id: 5, name: 'Food Truck', difficulty: 'medium', unlockScore: 800 },
    { id: 6, name: 'Downtown Diner', difficulty: 'medium', unlockScore: 1200 },
    { id: 7, name: 'Steakhouse', difficulty: 'hard', unlockScore: 1800 },
    { id: 8, name: 'Fine Dining', difficulty: 'hard', unlockScore: 2500 },
    { id: 9, name: 'Master Chef', difficulty: 'hard', unlockScore: 3500 },
    { id: 10, name: "Myna's Kitchen", difficulty: 'hard', unlockScore: 5000 },
]

const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
}

export function RoomScreen({ roomId }: RoomScreenProps) {
    const router = useRouter()
    const [players, setPlayers] = useState<Player[]>([])
    const [myCharacter, setMyCharacter] = useState<string | undefined>(undefined)
    const [selectedLevel, setSelectedLevel] = useState<number>(1)
    const [userId, setUserId] = useState<string>('')
    const [isHost, setIsHost] = useState<boolean>(false)
    const supabase = createClient()

    const myCharacterRef = useRef<string | undefined>(undefined)
    const selectedLevelRef = useRef<number>(1)

    // Sync refs when state changes
    useEffect(() => {
        myCharacterRef.current = myCharacter
    }, [myCharacter])

    useEffect(() => {
        selectedLevelRef.current = selectedLevel
    }, [selectedLevel])

    useEffect(() => {
        const initLobby = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

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
                                name: presence.name || 'Chef',
                                characterId: presence.characterId,
                                isReady: presence.isReady,
                                joinedAt: presence.online_at ? new Date(presence.online_at).getTime() : Date.now()
                            })
                        })
                    })

                    // Sort by join time to keep order stable
                    activePlayers.sort((a, b) => a.joinedAt - b.joinedAt)
                    setPlayers(activePlayers)

                    // Determine if I am the host (first player)
                    if (activePlayers.length > 0 && activePlayers[0].userId === myId) {
                        setIsHost(true)
                    }
                })
                .on('broadcast', { event: 'start_game' }, (payload) => {
                    const charId = myCharacterRef.current
                    const level = payload.payload?.level || 1
                    const params = new URLSearchParams()
                    if (charId) params.set('character', charId)
                    params.set('level', String(level))
                    router.push(`/game/${roomId}?${params.toString()}`)
                })
                .on('broadcast', { event: 'level_changed' }, (payload) => {
                    // Sync level from host
                    if (payload.payload?.level) {
                        setSelectedLevel(payload.payload.level)
                    }
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        await channel.track({
                            userId: myId,
                            name: user.email?.split('@')[0] || 'Chef',
                            characterId: undefined,
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
        if (players.some(p => p.characterId === charId && p.userId !== userId)) return

        setMyCharacter(charId)

        const channel = supabase.channel(`room:${roomId}`)
        await channel.track({
            userId: userId,
            name: players.find(p => p.userId === userId)?.name || 'Chef',
            characterId: charId,
            online_at: new Date().toISOString(),
        })
    }

    const handleSelectLevel = async (levelId: number) => {
        if (!isHost) return // Only host can change level

        setSelectedLevel(levelId)

        // Broadcast level change to all players
        const channel = supabase.channel(`room:${roomId}`)
        await channel.send({
            type: 'broadcast',
            event: 'level_changed',
            payload: { level: levelId },
        })
    }

    const handleStartGame = async () => {
        const channel = supabase.channel(`room:${roomId}`)

        // Include all player characterIds in the broadcast
        const playerData = players.map(p => ({
            id: p.userId,
            characterId: p.characterId
        }))

        await channel.send({
            type: 'broadcast',
            event: 'start_game',
            payload: {
                level: selectedLevelRef.current,
                players: playerData
            },
        })

        const charId = myCharacterRef.current
        const params = new URLSearchParams()
        if (charId) params.set('character', charId)
        params.set('level', String(selectedLevelRef.current))
        // Encode player data for multiplayer sync
        params.set('players', JSON.stringify(playerData))
        router.push(`/game/${roomId}?${params.toString()}`)
    }

    // Grid slots (4 max)
    const gridSlots = Array(4).fill(null).map((_, i) => players[i] || null)

    const selectedLevelData = LEVELS.find(l => l.id === selectedLevel)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <GameContainer className="max-w-6xl flex-1 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">

                    {/* Left Side: Character & Level Selection (5 cols) */}
                    <div className="md:col-span-5 flex flex-col gap-4">
                        {/* Character Selection */}
                        <Card className="border-2">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>Chọn Nhân Vật</span>
                                    <Badge variant={myCharacter ? "default" : "outline"}>
                                        {myCharacter ? 'Đã chọn' : 'Chưa chọn'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Large Preview */}
                                <div className="flex justify-center">
                                    <div className="relative w-32 h-32 rounded-xl bg-accent/30 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
                                        {myCharacter ? (
                                            <Image
                                                src={`/assets/characters/${myCharacter}.png`}
                                                alt={myCharacter}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <div className="text-center text-muted-foreground text-sm">
                                                <User className="h-8 w-8 mx-auto mb-1 opacity-50" />
                                                <span>Chọn bên dưới</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Character Grid */}
                                <div className="grid grid-cols-4 gap-2">
                                    {AVAILABLE_CHARACTERS.map((charId) => {
                                        const isTaken = players.some(p => p.characterId === charId && p.userId !== userId)
                                        const isSelected = myCharacter === charId

                                        return (
                                            <button
                                                key={charId}
                                                disabled={isTaken}
                                                onClick={() => handleSelectCharacter(charId)}
                                                className={`
                                                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                                    ${isSelected ? 'border-primary ring-2 ring-primary/20 scale-105 z-10' : 'border-transparent hover:border-primary/50'}
                                                    ${isTaken ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer bg-accent/20'}
                                                `}
                                            >
                                                <Image
                                                    src={`/assets/characters/${charId}.png`}
                                                    alt={charId}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                                {isTaken && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white text-xs">
                                                        <Lock className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Level Selection */}
                        <Card className="border-2 flex-1">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>Chọn Màn Chơi</span>
                                    {isHost ? (
                                        <Badge variant="default">Host</Badge>
                                    ) : (
                                        <Badge variant="outline">Chờ Host</Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {LEVELS.map((level) => {
                                        const isLocked = level.unlockScore > 0 // For now, show as unlockable
                                        const isSelected = selectedLevel === level.id

                                        return (
                                            <button
                                                key={level.id}
                                                disabled={!isHost}
                                                onClick={() => handleSelectLevel(level.id)}
                                                className={`
                                                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                                    ${isSelected ? 'border-primary ring-2 ring-primary/30 scale-105 z-10' : 'border-muted'}
                                                    ${!isHost ? 'cursor-default' : 'cursor-pointer hover:border-primary/50'}
                                                    bg-gradient-to-br from-accent/30 to-accent/10
                                                `}
                                            >
                                                {/* Level Number */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-bold">{level.id}</span>
                                                    <div className={`w-2 h-2 rounded-full ${difficultyColors[level.difficulty as keyof typeof difficultyColors]}`} />
                                                </div>

                                                {/* Lock overlay for locked levels */}
                                                {isLocked && (
                                                    <div className="absolute top-1 right-1">
                                                        <Lock className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                )}

                                                {/* Selected indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-1 left-1">
                                                        <Star className="h-3 w-3 text-primary fill-primary" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Selected Level Info */}
                                {selectedLevelData && (
                                    <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-dashed">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">{selectedLevelData.name}</span>
                                            <Badge className={difficultyColors[selectedLevelData.difficulty as keyof typeof difficultyColors]}>
                                                {selectedLevelData.difficulty.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {/* Room ID */}
                                <div className="mt-4 p-3 bg-muted/20 rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Room:</span>
                                    <div className="flex items-center gap-2 font-mono text-sm">
                                        {roomId.slice(0, 8)}...
                                        <Copy className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground"
                                            onClick={() => navigator.clipboard.writeText(roomId)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Player Grid (7 cols) */}
                    <div className="md:col-span-7 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            {gridSlots.map((player, i) => (
                                <Card key={i} className={`
                                    relative flex flex-col items-center justify-center min-h-[180px] border-2 transition-all
                                    ${player ? 'border-primary/50 bg-primary/5' : 'border-dashed border-muted-foreground/20 bg-muted/10'}
                                `}>
                                    {player ? (
                                        <>
                                            <div className="relative w-24 h-24 mb-3">
                                                {player.characterId ? (
                                                    <Image
                                                        src={`/assets/characters/${player.characterId}.png`}
                                                        alt="Character"
                                                        fill
                                                        className="object-contain drop-shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-full animate-pulse">
                                                        <ChefHat className="h-12 w-12 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                {player.userId === userId && (
                                                    <Badge className="absolute -top-1 -right-1 text-xs">Bạn</Badge>
                                                )}
                                                {i === 0 && (
                                                    <Badge variant="secondary" className="absolute -top-1 -left-1 text-xs">Host</Badge>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-primary">{player.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {player.characterId ? 'Sẵn sàng' : 'Đang chọn...'}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="text-center text-muted-foreground/40">
                                            <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm font-medium">Waiting...</p>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        {/* Start Game Button */}
                        <Button
                            size="lg"
                            className="w-full h-14 text-xl font-bold shadow-lg uppercase tracking-wider"
                            disabled={!myCharacter}
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
