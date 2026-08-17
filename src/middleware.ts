import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

const protectedRoutes = ['/dashboard', '/onboarding'];
const authRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  let verifiedToken = null;
  if (token) {
    verifiedToken = await verifyJWT(token);
  }

  if (isProtectedRoute && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && verifiedToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
