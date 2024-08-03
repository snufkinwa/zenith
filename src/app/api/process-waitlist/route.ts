import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/utils/supabaseServerClient';

async function sendMagicLinks(): Promise<void> {
  const { data: waitlist, error } = await supabaseServerClient
    .from('waitlist')
    .select('email');

  if (error) {
    console.error('Error fetching waitlist emails:', error);
    return;
  }

  for (const entry of waitlist) {
    const { email } = entry;
    const { error: authError } = await supabaseServerClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: '/',
      },
    });

    if (authError) {
      console.error(`Error sending magic link to ${email}:`, authError);
    } else {
      console.log(`Magic link sent to ${email}`);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await sendMagicLinks();
    return NextResponse.json({ message: 'Magic links sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending magic links:', error);
    return NextResponse.json({ error: 'Failed to send magic links' }, { status: 500 });
  }
}