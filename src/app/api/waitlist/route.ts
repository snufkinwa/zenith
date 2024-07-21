import { db } from '@config/firebase/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await addDoc(collection(db, 'waitlist'), {
      email,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Successfully added to the waitlist!' }, { status: 200 });
  } catch (error) {
    console.error('Error adding to waitlist: ', error);
    return NextResponse.json({ message: 'Failed to join the waitlist. Please try again.' }, { status: 500 });
  }
}
