import Link from "next/link";
import { Header } from "@/components/common/Header";
import { GameContainer } from "@/components/common/GameContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, RotateCcw, Home } from "lucide-react";

export default function ResultPage() {
    return (
        <>
            <Header />
            <GameContainer className="justify-center items-center space-y-8">
                <div className="text-center space-y-2 animate-in zoom-in duration-500">
                    <h1 className="text-5xl font-black text-primary">Service Complete!</h1>
                    <p className="text-xl text-muted-foreground">What a chaotic shift!</p>
                </div>

                <Card className="w-full max-w-md border-4 border-accent/30 shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl text-accent-foreground/80">3 Stars!</CardTitle>
                        <div className="flex justify-center gap-2 pt-2">
                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-500" />
                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-500" />
                            <Star className="h-8 w-8 fill-yellow-400 text-yellow-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Total Score</span>
                                <span>1,250</span>
                            </div>
                            <Progress value={85} className="h-4" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <div className="text-2xl font-bold">12</div>
                                <div className="text-xs text-muted-foreground">Orders Served</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-destructive">2</div>
                                <div className="text-xs text-muted-foreground">Burnt Dishes</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 w-full max-w-md">
                    <Button variant="outline" className="flex-1" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" /> Home
                        </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                        <Link href="/lobby">
                            <RotateCcw className="mr-2 h-4 w-4" /> Play Again
                        </Link>
                    </Button>
                </div>
            </GameContainer>
        </>
    );
}
