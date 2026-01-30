import Image from 'next/image'
import React from 'react'
import { Logo } from '@/components/common/Logo'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-primary/10">
      <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex justify-center mb-8">
            <Logo iconSize={120} />
          </div>
          {(title || description) && (
            <div className="flex flex-col space-y-2 text-center">
              {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
          {children}
        </div>
        <div className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Cook with Myna
        </div>
      </div>

      <div className="hidden flex-1 lg:flex flex-col items-center justify-center relative overflow-hidden">
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
  )
}
