export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    CALLBACK: '/auth/callback',
  },
  PROTECTED: {
    DASHBOARD: '/dashboard',
    GAME: '/game',
    ROOM: '/room',
    PROFILE: '/profile',
  },
} as const

/** Routes that don't require authentication */
export const PUBLIC_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.CALLBACK,
]

/** Routes that require authentication */
export const PROTECTED_ROUTES = [
  ROUTES.PROTECTED.DASHBOARD,
  ROUTES.PROTECTED.GAME,
  ROUTES.PROTECTED.ROOM,
  ROUTES.PROTECTED.PROFILE,
]

/** Auth routes - redirect to dashboard if authenticated */
export const AUTH_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER]
