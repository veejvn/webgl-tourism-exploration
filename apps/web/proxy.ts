import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/explore', '/profile', '/dashboard'];
const publicRoutes = ['/', '/login', '/register', '/map'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/map', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
