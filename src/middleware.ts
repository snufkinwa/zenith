import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const allowedOrigins = [
  'https://zenith-delta.vercel.app',
  'https://zenith-git-working-branch-snufkinwas-projects.vercel.app',
  'http://localhost:3000',
];

const API_KEY = process.env.API_KEY;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  if (pathname.startsWith('/beta')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const redirectUrl = new URL('/beta', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname.startsWith('/api/waitlist')) {
    const origin = req.headers.get('origin');
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== API_KEY) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/beta', '/beta/:path*', '/api/waitlist', '/api/waitlist/:path*'],
};
