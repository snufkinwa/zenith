import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/utils/supabaseServerClient';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405, headers: { 'Allow': 'POST' } });
  }

  try {
    const { error } = await supabaseServerClient.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}