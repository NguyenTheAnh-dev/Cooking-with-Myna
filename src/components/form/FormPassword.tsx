'use client'

import { InputHTMLAttributes, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

interface FormPasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
    name: string
    label: string
}

export function FormPassword({ name, label, className, ...props }: FormPasswordProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const [showPassword, setShowPassword] = useState(false)

    const error = errors[name]?.message as string | undefined

    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={name}>{label}</Label>
            <div className="relative">
                <Input
                    id={name}
                    type={showPassword ? 'text' : 'password'}
                    {...register(name)}
                    {...props}
                    className={cn(
                        'pr-10',
                        error && 'border-destructive focus:ring-destructive'
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

