import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(ROUTES.AUTH.LOGIN)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
                Chào mừng, {user.email}!
            </p>
            <form action={logoutAction}>
                <Button type="submit" variant="outline">
                    Đăng xuất
                </Button>
            </form>
        </div>
    )
}
