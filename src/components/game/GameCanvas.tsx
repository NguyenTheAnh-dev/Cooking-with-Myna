'use client'

import React, { useEffect, useRef } from 'react'

interface GameCanvasProps {
  roomId?: string | null
  playerId?: string
  characterId?: string
}

export default function GameCanvas({ roomId = null, playerId = 'guest-' + Math.floor(Math.random() * 1000), characterId }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR issues with PIXI
    let gameApp: unknown

    const initGame = async () => {
      if (!containerRef.current) return

      const { GameApp } = await import('@/game/core/GameApp')
      gameApp = GameApp.getInstance()
      await (gameApp as { initialize: (el: HTMLElement, roomId: string | null, playerId: string, characterId?: string) => Promise<void> }).initialize(
        containerRef.current,
        roomId,
        playerId,
        characterId
      )
    }

    initGame()

    return () => {
      if (gameApp) {
        ; (gameApp as { destroy: () => void }).destroy()
      }
    }
  }, [roomId, playerId, characterId])

  return <div ref={containerRef} className="w-full h-screen bg-slate-900 overflow-hidden" />
}
