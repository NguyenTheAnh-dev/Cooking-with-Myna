'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

interface FormPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
}

const FormPassword = forwardRef<HTMLInputElement, FormPasswordProps>(
    ({ name, label, className, ...props }, ref) => {
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
                        ref={ref}
                        className={cn(
                            'pr-10',
                            error && 'border-red-500 focus-visible:ring-red-500'
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        )
    }
)

FormPassword.displayName = 'FormPassword'

export { FormPassword }
