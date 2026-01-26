'use server'

import { createClient } from '@/lib/supabase/server'
import { LoginInput, RegisterInput, ResetPasswordInput } from '@/schemas/auth.schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

export async function loginAction(data: LoginInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath(ROUTES.DASHBOARD, 'layout')
  redirect(ROUTES.DASHBOARD)
}

export async function registerAction(data: RegisterInput) {
  console.log('registerAction called with:', { email: data.email, hasPassword: !!data.password })
  
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  console.log('signUp result:', { user: authData?.user?.id, error: authError?.message })

  if (authError) {
    return { success: false, message: authError.message }
  }

  // Profile is automatically created by database trigger (handle_new_user)

  return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.' }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath(ROUTES.DASHBOARD, 'layout')
  redirect(ROUTES.AUTH.LOGIN)
}

export async function resetPasswordAction(data: ResetPasswordInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${ROUTES.AUTH.CALLBACK}?next=${ROUTES.AUTH.RESET_PASSWORD}`,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.' }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function resendConfirmationAction(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư.' }
}
