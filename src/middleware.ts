import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // AWS Cognito JWT validation will be handled by Amplify
  
  const protectedRoutes = ['/beta', '/dashboard', '/problems']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Client-side Amplify will handle auth redirects
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}