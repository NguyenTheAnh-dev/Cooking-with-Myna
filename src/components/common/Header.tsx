import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-foreground bg-primary px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform">
                    <ChefHat className="h-6 w-6" />
                    <span>Cook with Myna</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/lobby">Find Room</Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
