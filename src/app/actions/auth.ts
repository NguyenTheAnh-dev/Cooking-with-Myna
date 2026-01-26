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

  revalidatePath(ROUTES.HOME, 'layout')
  redirect(ROUTES.HOME)
}

export async function registerAction(data: RegisterInput) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError) {
    return { success: false, message: authError.message }
  }

  if (authData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (!profile) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          email: data.email,
        },
      ])

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }
  }

  return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.' }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath(ROUTES.HOME, 'layout')
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
