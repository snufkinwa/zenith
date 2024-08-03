import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/utils/supabaseServerClient';

export async function POST(request: Request) {
  try {
    const { provider } = await request.json();

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const { data, error } = await supabaseServerClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
      }
    });

    if (error) {
      console.error('Supabase OAuth error:', error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.url) {
      console.error('No URL returned from Supabase');
      return NextResponse.json({ error: 'Failed to get authentication URL' }, { status: 500 });
    }

    return NextResponse.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}