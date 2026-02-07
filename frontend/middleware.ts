import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define public routes that don't require authentication
const publicPaths = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/auth',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  // Extract session token from cookies
  const sessionToken = request.cookies.get('taskoo-v2.session_token')?.value;

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If it's a protected path but no session token exists, redirect to sign-in
  if (!sessionToken) {
    // Redirect to sign-in with a return URL
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If there's a session token, verify it by calling the backend
  try {
    // Make a request to the backend to verify the session
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/auth/session`, {
      headers: {
        'Cookie': `taskoo-v2.session_token=${sessionToken}`
      }
    });

    if (!response.ok) {
      // If session is invalid, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Session is valid, allow access
    return NextResponse.next();
  } catch (error) {
    // If there's an error verifying the session, redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }
}

// Apply middleware to all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};