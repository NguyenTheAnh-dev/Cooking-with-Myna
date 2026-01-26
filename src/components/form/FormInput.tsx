import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
    name: string
    label: string
}

export function FormInput({ name, label, className, ...props }: FormInputProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const error = errors[name]?.message as string | undefined

    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                {...register(name)}
                {...props}
                className={cn(error && 'border-destructive focus:ring-destructive')}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

