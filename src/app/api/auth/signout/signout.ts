import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServerClient } from '@/utils/supabaseServerClient';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { error } = await supabaseServerClient.auth.signOut();

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
