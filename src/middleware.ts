import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/beta')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/beta', '/beta/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)']
};