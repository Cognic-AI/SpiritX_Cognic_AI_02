// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Bypass authentication for authentication-related routes and public pages
  if (
    pathname.startsWith('/api/auth') || 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request });
  
  // If not authenticated and trying to access protected routes
  if (!token) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', request.url));
    }
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Redirect to login for user routes
    if (
      pathname.startsWith('/home') ||
      pathname.startsWith('/players') || 
      pathname.startsWith('/select-team') || 
      pathname.startsWith('/team') || 
      pathname.startsWith('/budget') || 
      pathname.startsWith('/leaderboard')
    ) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
    }
    
    return NextResponse.next();
  }
  
  // Check admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (token.role !== 'admin') {
      // Not an admin, redirect to user dashboard
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
  
  // If authenticated and at root, redirect to appropriate dashboard
  if (pathname === '/') {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
  
  // If user is authenticated and trying to access login/register pages, redirect to appropriate dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
  
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};