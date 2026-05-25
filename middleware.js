import { NextResponse } from 'next/server';

// Lightweight edge-level guard for the admin route. The real auth is still
// enforced by the Go backend on each API call — this just prevents the
// admin shell HTML from rendering for visitors with no session marker.
//
// The marker cookie `admin_session_active` is set by the frontend on
// successful login (the httpOnly JWT cookie itself is unreadable from JS,
// so we use a sibling marker to know when to allow the shell through).
export function middleware(request) {
    const marker = request.cookies.get('admin_session_active');
    if (!marker) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.rewrite(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
