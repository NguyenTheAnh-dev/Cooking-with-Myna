import type { Metadata } from 'next'
import { Outfit } from 'next/font/google' // Changed to Outfit as requested "cute/fun" font (or similar modern/rounded)
import './globals.css'
import { cn } from '@/lib/utils'

const font = Outfit({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={cn(font.className, "antialiased min-h-screen bg-background")}>
        {children}
      </body>
    </html>
  )
}
