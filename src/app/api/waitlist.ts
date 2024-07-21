import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@config/firebase/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      await addDoc(collection(db, 'waitlist'), {
        email,
        timestamp: serverTimestamp(),
      });

      res.status(200).json({ message: 'Successfully added to the waitlist!' });
    } catch (error) {
      console.error('Error adding to waitlist: ', error);
      res.status(500).json({ message: 'Failed to join the waitlist. Please try again.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}