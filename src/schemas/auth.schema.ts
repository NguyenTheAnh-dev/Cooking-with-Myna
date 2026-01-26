import { z } from 'zod'
import { commonValidations, VALIDATION_MESSAGES } from '@/constants/validations'

export const LoginSchema = z.object({
  email: commonValidations.email,
  password: z.string().min(1, { message: VALIDATION_MESSAGES.PASSWORD_REQUIRED }),
})

export const RegisterSchema = z
  .object({
    email: commonValidations.email,
    password: commonValidations.password,
    confirmPassword: z.string({ message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED }).min(1, { message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  })

export const ResetPasswordSchema = z.object({
  email: commonValidations.email,
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
