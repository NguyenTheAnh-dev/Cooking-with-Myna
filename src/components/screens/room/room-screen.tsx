'use client'

import { Header } from "@/components/common/Header";
import { GameContainer } from "@/components/common/GameContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Copy } from "lucide-react";

interface RoomScreenProps {
    roomId: string
}

export function RoomScreen({ roomId }: RoomScreenProps) {
    return (
        <>
            <Header />
            <GameContainer className="max-w-3xl">
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    {/* Room Info */}
                    <div className="flex-1 space-y-6">
                        <Card className="bg-primary/5 border-2 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-center text-primary">Room Code</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <div className="text-5xl font-mono font-bold tracking-widest text-foreground bg-background px-6 py-4 rounded-xl border border-dashed border-input relative group cursor-pointer hover:bg-accent/5 transition-colors">
                                    {roomId}
                                    <Copy className="absolute right-2 top-2 h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
                                </div>
                                <Badge variant="secondary" className="px-3 py-1 text-sm">
                                    Waiting for players...
                                </Badge>
                            </CardContent>
                        </Card>

                        <div className="flex-1"></div>
                        <Button size="lg" className="w-full h-14 text-xl shadow-lg animate-pulse mt-auto">
                            Start Cooking!
                        </Button>
                    </div>

                    {/* Player List */}
                    <div className="flex-1">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Chefs</span>
                                    <Badge variant="outline">2/4</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { name: "You (Chef Myna)", status: "Ready", color: "bg-primary" },
                                    { name: "Chef Gordon", status: "Not Ready", color: "bg-blue-400" },
                                    { name: "Empty Slot", status: "Waiting...", color: "bg-muted" },
                                    { name: "Empty Slot", status: "Waiting...", color: "bg-muted" },
                                ].map((player, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${player.color}`}>
                                                <ChefHat className="h-5 w-5" />
                                            </div>
                                            <span className="font-semibold">{player.name}</span>
                                        </div>
                                        <Badge variant={player.status === "Ready" ? "default" : "secondary"}>
                                            {player.status}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </GameContainer>
        </>
    );
}
