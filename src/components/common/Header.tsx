import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
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
  )
}
