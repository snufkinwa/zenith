import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page or a success page
  return NextResponse.redirect(new URL('/beta', request.url));
}

export async function POST(request: Request) {
  const { access_token, refresh_token } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });

  if (access_token && refresh_token) {
    try {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error('Error setting session:', error);
        return NextResponse.json({ error: 'Failed to set session' }, { status: 400 });
      }

      return NextResponse.json({ message: 'Session set successfully' });
    } catch (error) {
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}