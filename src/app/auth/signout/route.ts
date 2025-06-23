// src/app/auth/signout/route.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // For AWS Cognito with react-oidc-context, signout is handled client-side
  // This route just redirects to home page
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  });
}

// Also handle GET requests for direct signout links
export async function GET(req: NextRequest) {
  // Redirect to Cognito logout URL
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const logoutUri =
    process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI || req.url.split('/auth')[0];
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;

  if (cognitoDomain && clientId) {
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    return NextResponse.redirect(logoutUrl, { status: 302 });
  }

  // Fallback to home page
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  });
}
