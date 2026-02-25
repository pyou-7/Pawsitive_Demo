import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public API routes - no auth required
  const publicRoutes = ['/api/auth/callback', '/api/health'];
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Create Supabase client to verify session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Not needed for middleware
        },
      },
    }
  );

  // Verify the user's session
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please sign in via GitHub OAuth' },
      { status: 401 }
    );
  }

  // Add user info to headers for API handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-owner-id', session.user.id);
  requestHeaders.set('x-user-email', session.user.email || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply middleware only to protected API routes
export const config = {
  matcher: [
    '/api/pets/:path*',
    '/api/activity-logs/:path*',
    '/api/care-plans/:path*',
    '/api/owners/me/stats',
  ],
};
