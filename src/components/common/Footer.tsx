import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row text-sm text-muted-foreground">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} Cook with Myna. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
