'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterInput, RegisterSchema } from '@/schemas/auth.schema'
import { registerAction } from '@/app/actions/auth'
import { FormProvider } from 'react-hook-form'
import { FormInput } from '@/components/form/FormInput'
import { FormPassword } from '@/components/form/FormPassword'
import { FormError } from '@/components/form/FormError'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { AuthLayout } from '@/components/layout/AuthLayout'

export function RegisterScreen() {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()

    const methods = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = (values: RegisterInput) => {
        setError('')
        setSuccess('')
        startTransition(async () => {
            const result = await registerAction(values)
            if (result.success) {
                setSuccess(result.message)
                methods.reset()
            } else {
                setError(result.message)
            }
        })
    }

    return (
        <AuthLayout
            title="Đăng ký"
            description="Tạo tài khoản mới để bắt đầu"
        >
            {success ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                        <CheckCircle2 className="h-8 w-8 text-accent" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold">Đăng ký thành công!</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {success}
                        </p>
                    </div>
                    <Link
                        href={ROUTES.AUTH.LOGIN}
                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Đi tới đăng nhập
                    </Link>
                </div>
            ) : (
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            disabled={isPending}
                        />
                        <FormPassword
                            name="password"
                            label="Mật khẩu"
                            placeholder="******"
                            disabled={isPending}
                        />
                        <FormPassword
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            placeholder="******"
                            disabled={isPending}
                        />
                        <FormError message={error} />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Đang xử lý...' : 'Đăng ký'}
                        </Button>
                    </form>
                </FormProvider>
            )}
            <div className="mt-4 text-center text-sm">
                Đã có tài khoản?{' '}
                <Link href={ROUTES.AUTH.LOGIN} className="underline underline-offset-4 hover:text-primary">
                    Đăng nhập
                </Link>
            </div>
        </AuthLayout>
    )
}
