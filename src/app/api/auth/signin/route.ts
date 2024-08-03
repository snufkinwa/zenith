import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServerClient } from '@/utils/supabaseServerClient';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const { error } = await supabaseServerClient.auth.signInWithPassword({ email, password });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.status(200).json({ message: 'Signed in successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
