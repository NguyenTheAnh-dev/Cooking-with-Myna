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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { AuthLayout } from '@/components/layout/AuthLayout'

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
        <AuthLayout
            title="Đặt lại mật khẩu"
            description="Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
        >
            {success ? (
                <Alert className="bg-accent/15 border-accent text-accent-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
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
            <div className="mt-4 text-center text-sm">
                <Link href={ROUTES.AUTH.LOGIN} className="underline underline-offset-4 hover:text-primary">
                    Quay lại đăng nhập
                </Link>
            </div>
        </AuthLayout>
    )
}
