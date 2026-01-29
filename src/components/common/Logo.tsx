import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    className?: string;
    iconSize?: number;
}

export function Logo({ className = "", iconSize = 32 }: LogoProps) {
    return (
        <Link
            href="/"
            className={`flex items-center justify-center hover:scale-105 transition-transform w-fit ${className}`}
        >
            <div className="relative">
                <Image
                    src="/assets/logo.png"
                    alt="Cook with Myna Logo"
                    width={iconSize}
                    height={iconSize}
                    className="object-contain"
                />
            </div>
        </Link>
    );
}
