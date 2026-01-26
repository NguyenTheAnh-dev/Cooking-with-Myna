'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetPasswordInput, ResetPasswordSchema } from '@/schemas/auth.schema'
import { resetPasswordAction } from '@/app/actions/auth'
import { FormProvider } from 'react-hook-form'
import { FormInput } from '@/components/form/FormInput'
import { FormError } from '@/components/form/FormError'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

export function ResetPasswordScreen() {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()

    const methods = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = (values: ResetPasswordInput) => {
        setError('')
        setSuccess('')
        startTransition(async () => {
            const result = await resetPasswordAction(values)
            if (result.success) {
                setSuccess(result.message)
                methods.reset()
            } else {
                setError(result.message)
            }
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu</CardTitle>
                    <CardDescription className="text-center">
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle>Thành công!</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
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
                                <FormError message={error} />
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                                </Button>
                            </form>
                        </FormProvider>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                    <Link href={ROUTES.AUTH.LOGIN} className="text-blue-600 hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
