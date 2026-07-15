import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, TokenPayload } from './jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/', '/api/auth/login', '/api/auth/register'];
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  const payload = verifyAccessToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  if (pathname.startsWith('/lecturer') && !['lecturer', 'admin'].includes(payload.role)) {
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  if (pathname.startsWith('/student') && !['student', 'admin'].includes(payload.role)) {
    return NextResponse.redirect(new URL('/lecturer/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/lecturer/:path*', '/admin/:path*'],
};
