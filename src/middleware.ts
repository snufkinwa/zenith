import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  'https://zenith-delta.vercel.app',
  'https://zenith-git-working-branch-snufkinwas-projects.vercel.app',
  'http://localhost:3000',
];

const API_KEY = process.env.API_KEY;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/beta')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/api/waitlist')) {
    const requestHeaders = new Headers(req.headers);
    const origin = req.headers.get('origin');
    
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const apiKey = requestHeaders.get('x-api-key');
    if (apiKey !== API_KEY) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/beta', '/beta/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)',],
};
