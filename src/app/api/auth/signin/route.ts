import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/utils/supabaseServerClient';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405, headers: { 'Allow': 'POST' } });
  }

  try {
    const { email, password } = await req.json();
    const { data, error } = await supabaseServerClient.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: 'Signed in successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}