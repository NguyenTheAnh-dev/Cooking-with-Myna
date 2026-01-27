import { type NextRequest, NextResponse } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxy";
import { ROUTES, AUTH_ROUTES, PROTECTED_ROUTES } from "@/constants/routes";

/**
 * Next.js Middleware for authentication proxy.
 *
 * Rules:
 * - If user is NOT authenticated → redirect to /login for protected routes
 * - If user IS authenticated → allow access to protected routes
 * - If user IS authenticated and tries to access /login or /register → redirect to /dashboard
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create Supabase proxy client
  const { supabase, response } = createProxyClient(request);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Check if current path matches any protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if current path is an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Rule 0: If accessing root `/`, redirect based on auth status
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    } else {
      return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
    }
  }

  // Rule 1: If not authenticated and trying to access protected route → redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Rule 2: If authenticated and trying to access auth pages → redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  // Allow the request to continue
  return response;
}

/**
 * Matcher configuration for middleware.
 *
 * Excludes:
 * - /_next (Next.js internals)
 * - /api (API routes - they handle their own auth)
 * - /favicon.ico
 * - Static assets (images, fonts, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
