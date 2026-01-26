import { InputHTMLAttributes, forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ name, label, className, ...props }, ref) => {
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
                    ref={ref}
                    className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        )
    }
)

FormInput.displayName = 'FormInput'

export { FormInput }
