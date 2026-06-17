import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'padelhub-auth';

type CookiePayload = {
  isAuthenticated: boolean;
  role: string;
  email: string;
  name: string;
};

function parseAuthCookie(request: NextRequest): CookiePayload | null {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) return null;
  try {
    return JSON.parse(decodeURIComponent(cookie.value));
  } catch {
    return null;
  }
}

const PROTECTED_ROUTES = [
  { pattern: /^\/bookings(?:\/.*)?$/, roles: ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] },
  { pattern: /^\/venues\/[^/]+\/booking(?:\/.*)?$/, roles: ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] },
  { pattern: /^\/admin(?:\/.*)?$/, roles: ['ADMIN', 'SUPER_ADMIN'] },
  { pattern: /^\/super-admin(?:\/.*)?$/, roles: ['SUPER_ADMIN'] },
];

const PUBLIC_ROUTES = ['/login', '/register', '/', '/venues'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = parseAuthCookie(request);

  if (auth?.isAuthenticated) {
    if (pathname === '/login' || pathname === '/register') {
      const role = auth.role;
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      if (role === 'SUPER_ADMIN') return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
      return NextResponse.redirect(new URL('/venues', request.url));
    }
  }

  for (const route of PROTECTED_ROUTES) {
    if (route.pattern.test(pathname)) {
      if (!auth?.isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!route.roles.includes(auth.role)) {
        if (auth.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        if (auth.role === 'SUPER_ADMIN') return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
        return NextResponse.redirect(new URL('/venues', request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
