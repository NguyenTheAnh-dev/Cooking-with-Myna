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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'

export function LoginScreen() {
    const [error, setError] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()

    const methods = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
                    <CardDescription className="text-center">
                        Chào mừng bạn quay trở lại!
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm">
                    <Link href={ROUTES.AUTH.RESET_PASSWORD} className="text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </Link>
                    <div className="text-gray-500">
                        Chưa có tài khoản?{' '}
                        <Link href={ROUTES.AUTH.REGISTER} className="text-blue-600 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
