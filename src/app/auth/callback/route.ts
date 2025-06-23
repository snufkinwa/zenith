// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // Get the redirect destination
  const next = searchParams.get('next') ?? '/beta';
  
  // Create response with proper headers for OAuth callback
  const response = NextResponse.redirect(`${origin}${next}`);
  
  // Add headers to ensure proper authentication state
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}
