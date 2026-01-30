import { cn } from '@/lib/utils'

interface GameContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GameContainer({ children, className, ...props }: GameContainerProps) {
  return (
    <div
      className={cn(
        'container max-w-4xl mx-auto py-6 px-4 min-h-[calc(100vh-4rem)] flex flex-col',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
