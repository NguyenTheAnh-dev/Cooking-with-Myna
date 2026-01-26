import Link from "next/link";
import { Header } from "@/components/common/Header";
import { GameContainer } from "@/components/common/GameContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Users, Trophy } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <GameContainer className="justify-center items-center text-center space-y-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-6xl font-black text-primary drop-shadow-sm tracking-tight">
            Cooking with Myna
          </h1>
          <p className="text-xl text-muted-foreground">
            The cutest, most chaotic multiplayer cooking game! <br />
            Grab your apron and join the kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
          <Button size="lg" className="w-full text-lg h-16 shadow-md hover:scale-105 transition-transform" asChild>
            <Link href="/lobby">
              <Utensils className="mr-2 h-6 w-6" />
              Quick Play
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="w-full text-lg h-16 shadow-md hover:scale-105 transition-transform" asChild>
            <Link href="/lobby?mode=create">
              <Users className="mr-2 h-6 w-6" />
              Create Room
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8">
          {[
            { icon: Users, title: "Multiplayer", desc: "Up to 4 chefs" },
            { icon: Utensils, title: "Fast Paced", desc: "3 min rounds" },
            { icon: Trophy, title: "Rewards", desc: "Unlock recipes" },
          ].map((feature, i) => (
            <Card key={i} className="bg-card/50 border-none shadow-sm">
              <CardHeader className="pb-2">
                <feature.icon className="w-8 h-8 mx-auto text-accent" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </GameContainer>
    </>
  );
}
