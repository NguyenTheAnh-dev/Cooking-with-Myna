import Link from "next/link";
import { Header } from "@/components/common/Header";
import { GameContainer } from "@/components/common/GameContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

export default function LoginPage() {
    return (
        <>
            <Header />
            <GameContainer className="justify-center items-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Welcome Back, Chef!</CardTitle>
                        <CardDescription className="text-center">Enter your details to login</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="chef@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full">Login</Button>
                        <Button variant="link" asChild>
                            <Link href="/register">Don't have an account? Sign up</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </GameContainer>
        </>
    );
}
