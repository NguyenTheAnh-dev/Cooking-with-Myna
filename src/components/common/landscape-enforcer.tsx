"use client"

import { useEffect, useState } from "react"
import { Smartphone } from "lucide-react"

export function LandscapeEnforcer() {
    const [isPortrait, setIsPortrait] = useState(false)

    useEffect(() => {
        const checkOrientation = () => {
            const portrait = window.matchMedia("(orientation: portrait)").matches
            setIsPortrait(portrait)
        }

        checkOrientation()

        const mediaQuery = window.matchMedia("(orientation: portrait)")
        const handleChange = (e: MediaQueryListEvent) => setIsPortrait(e.matches)

        mediaQuery.addEventListener("change", handleChange)

        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    if (!isPortrait) return null

    const handleAttemptRotate = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen()
            }
            if (screen.orientation && (screen.orientation as any).lock) {
                await (screen.orientation as any).lock("landscape")
            }
        } catch (err) {
            console.log("Rotation/Fullscreen not supported or blocked:", err)
        }
    }

    return (
        <div className="fixed inset-0 z-9999 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 md:hidden">
            <div className="animate-bounce mb-8">
                <Smartphone className="w-24 h-24 text-primary rotate-90" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-foreground">
                Vui lòng xoay ngang thiết bị
            </h2>

            <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                Cooking with Myna được thiết kế tối ưu cho màn hình ngang để có trải nghiệm tốt nhất!
            </p>

            <button
                onClick={handleAttemptRotate}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg active:scale-95 transition-transform"
            >
                Thử xoay tự động
            </button>
            <p className="text-xs text-muted-foreground mt-4 opacity-50">
                (Một số thiết bị có thể không hỗ trợ)
            </p>
        </div>
    )
}
