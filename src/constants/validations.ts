import { z } from 'zod'

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  PASSWORD_MIN: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_UPPERCASE: 'Mật khẩu phải chứa ít nhất 1 chữ hoa',
  PASSWORD_NUMBER: 'Mật khẩu phải chứa ít nhất 1 số',
  CONFIRM_PASSWORD_REQUIRED: 'Vui lòng xác nhận mật khẩu',
  PASSWORD_MISMATCH: 'Mật khẩu không khớp',
} as const

export const commonValidations = {
  email: z
    .string({ message: 'Vui lòng nhập email' })
    .min(1, { message: 'Vui lòng nhập email' })
    .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  password: z
    .string({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
}
