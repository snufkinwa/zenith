import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServerClient } from '@/utils/supabaseServerClient'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await sendMagicLinks();
      res.status(200).json({ message: 'Magic links sent successfully' });
    } catch (error) {
      console.error('Error sending magic links:', error);
      res.status(500).json({ error: 'Failed to send magic links' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
