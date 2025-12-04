import { NextRequest, NextResponse } from 'next/server';
import { getBetterAuthSession } from '@/lib/auth/server-auth';

const protectedRoutes = ['/dashboard', '/user', '/admin'];

const authRoutes = ['/auth', '/auth/signup', '/auth/forgot-password'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieHeader = req.headers.get('cookie') || '';
  let isAuthenticated = false;
  try {
    const betterAuthSession = await getBetterAuthSession(cookieHeader);
    if (betterAuthSession?.user) {
      isAuthenticated = true;
    }
  } catch {
    isAuthenticated = false;
  }

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL('/auth', req.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // if (isOtherUserProfile && !isAuthenticated) {
  //   const signinUrl = new URL('/auth', req.url);
  //   signinUrl.searchParams.set('callbackUrl', pathname);
  //   return NextResponse.redirect(signinUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
