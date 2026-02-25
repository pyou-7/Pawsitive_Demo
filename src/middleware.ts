import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for the x-owner-id header, which our client sends
    const ownerId = request.headers.get('x-owner-id');

    // We are verifying that an owner ID exists.
    // In a production app, we would verify a Supabase session JWT here.
    // We allow "demo" for hackathon judging fallback.
    if (!ownerId && !request.nextUrl.pathname.startsWith('/api/auth')) {
        return NextResponse.json(
            { error: 'Unauthorized. Please provide x-owner-id header or login to demo mode.' },
            { status: 401 }
        );
    }

    // Clone headers to pass the validated owner ID to the handlers securely
    const requestHeaders = new Headers(request.headers);
    if (ownerId) {
        requestHeaders.set('x-owner-id', ownerId);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// Only run middleware on protected API routes
export const config = {
    matcher: ['/api/pets/:path*', '/api/activity-logs/:path*', '/api/care-plans/:path*', '/api/owners/me/stats'],
};
