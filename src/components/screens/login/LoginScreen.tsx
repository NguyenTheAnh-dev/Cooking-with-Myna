'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginInput, LoginSchema } from '@/schemas/auth.schema'
import { loginAction } from '@/app/actions/auth'
import { FormProvider } from 'react-hook-form'
import { FormInput } from '@/components/form/FormInput'
import { FormPassword } from '@/components/form/FormPassword'
import { FormError } from '@/components/form/FormError'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import { AuthLayout } from '@/components/layout/AuthLayout'

export function LoginScreen() {
    const [error, setError] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()

    const methods = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = (values: LoginInput) => {
        setError('')
        startTransition(async () => {
            const result = await loginAction(values)
            if (result && !result.success) {
                setError(result.message)
            }
        })
    }

    return (
        <AuthLayout
            title="Đăng nhập"
        >
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
                    <FormError message={error} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>
            </FormProvider>
            <div className="mt-4 text-center text-sm">
                <Link href={ROUTES.AUTH.RESET_PASSWORD} className="underline underline-offset-4 hover:text-primary">
                    Quên mật khẩu?
                </Link>
            </div>
            <div className="text-center text-sm">
                Chưa có tài khoản?{' '}
                <Link href={ROUTES.AUTH.REGISTER} className="underline underline-offset-4 hover:text-primary">
                    Đăng ký ngay
                </Link>
            </div>
        </AuthLayout>
    )
}
