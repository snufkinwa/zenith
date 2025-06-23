import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const isAuthPage = ['/login', '/signup'].includes(request.nextUrl.pathname);
  const isProtectedPage = ['/beta', '/dashboard', '/problems'].some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
