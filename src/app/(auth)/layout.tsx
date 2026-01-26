import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-sm space-y-8">
                    {children}
                </div>
                <div className="mt-8 text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Cook with Myna
                </div>
            </div>

            <div className="hidden flex-1 lg:flex flex-col items-center justify-center bg-primary/10 relative overflow-hidden">
                <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
                    <Image
                        src="/assets/auth-hero-myna.png"
                        alt="Cook with Myna Characters"
                        width={800}
                        height={800}
                        className="object-contain animate-float"
                        priority
                        unoptimized
                    />
                </div>

            </div>
        </div>
    );
}
