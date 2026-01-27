'use client'

import React, { useEffect, useRef } from 'react'

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR issues with PIXI
    let gameApp: unknown

    const initGame = async () => {
      if (!containerRef.current) return

      const { GameApp } = await import('@/game/core/GameApp')
      gameApp = GameApp.getInstance()
      await (gameApp as { initialize: (el: HTMLElement) => Promise<void> }).initialize(
        containerRef.current
      )
    }

    initGame()

    return () => {
      if (gameApp) {
        ;(gameApp as { destroy: () => void }).destroy()
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-screen bg-slate-900 overflow-hidden" />
}
