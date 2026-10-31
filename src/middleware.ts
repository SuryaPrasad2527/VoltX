import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_SECRET = process.env.AUTH_SECRET || 'voltx_super_secure_jwt_secret_key_2025_998877';
const secretKey = new TextEncoder().encode(AUTH_SECRET);
const COOKIE_NAME = 'volt_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: { id: string; email: string; name: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      session = payload as any;
    } catch (e) {
      // Invalid or expired token
      session = null;
    }
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== 'ADMIN') {
      // Customer trying to access admin dashboard
      return NextResponse.redirect(new URL('/shop', request.url));
    }
    return NextResponse.next();
  }

  // Customer protected routes
  const protectedCustomerRoutes = ['/profile', '/orders', '/checkout'];
  if (protectedCustomerRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Guest-only auth routes (login & register)
  if (pathname === '/login' || pathname === '/register') {
    if (session) {
      if (session.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/shop', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
};
