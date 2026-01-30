'use client'

import React, { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/useGameStore'
import { Star, Clock } from 'lucide-react'

export function GameOverlay() {
    const { score, timeLeft, orders, isGameOver } = useGameStore()
    const [maxTime] = useState(180000) // 3 minutes total

    // Format time mm:ss
    const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const timeProgress = (timeLeft / maxTime) * 100

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
            {/* Top HUD */}
            <div className="flex justify-between items-start w-full">

                {/* Timer */}
                <div className="flex flex-col gap-1 w-48">
                    <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg text-white">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold font-mono text-xl">{formatTime(timeLeft)}</span>
                    </div>
                    <Progress value={timeProgress} className="h-3 border-2 border-white/20" />
                </div>

                {/* Score */}
                <div className="flex flex-col items-center">
                    <div className="bg-black/60 px-6 py-2 rounded-full border-2 border-yellow-500 flex items-center gap-3">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                        <span className="text-2xl font-bold text-white drop-shadow-md">{score}</span>
                    </div>
                </div>

                {/* Orders Queue */}
                <div className="flex gap-2">
                    {orders.map((order) => (
                        <Card key={order.id} className="w-24 h-28 bg-white/90 border-2 border-slate-300 shadow-xl overflow-hidden animate-in slide-in-from-right fade-in duration-300">
                            <CardContent className="p-2 flex flex-col items-center justify-between h-full">
                                <span className="text-xs font-bold text-center leading-tight">
                                    {order.recipeId.replace('_', ' ')}
                                </span>
                                {/* Visual Placeholder for Dish Icon if we had one */}
                                <div className="w-8 h-8 rounded-full bg-slate-200" />

                                <Progress value={(order.timeRemaining / order.totalTime) * 100} className="h-1.5 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Result Screen Modal */}
            {isGameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto animate-in fade-in duration-500">
                    <Card className="w-[500px] border-4 border-yellow-500 bg-slate-900 text-white shadow-2xl">
                        <CardContent className="flex flex-col items-center gap-6 p-10">
                            <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-lg tracking-wider">LEVEL COMPLETE!</h2>

                            <div className="flex items-center gap-4 text-3xl">
                                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold">{score} PTS</span>
                                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                            </div>

                            <div className="flex gap-4 mt-4">
                                <Button
                                    onClick={() => window.location.reload()} // Simple reload for now
                                    className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    PLAY AGAIN
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/dashboard'}
                                    variant="secondary"
                                    className="text-lg px-8 py-6 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    EXIT
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
