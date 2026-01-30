import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { LandscapeEnforcer } from '@/components/common/landscape-enforcer'

const font = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Cooking with Myna - Multiplayer Cooking Game',
  description: 'Join your friends in this cute, fast-paced cooking chaos!',
  openGraph: {
    title: 'Cooking with Myna',
    description: 'Join your friends in this cute, fast-paced cooking chaos!',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cooking with Myna',
    description: 'Join your friends in this cute, fast-paced cooking chaos!',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={cn(font.className, "antialiased min-h-screen bg-background")}>
        <LandscapeEnforcer />
        {children}
      </body>
    </html>
  )
}
