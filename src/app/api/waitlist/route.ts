import { NextRequest, NextResponse } from 'next/server';
import { db } from '@config/firebase/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  console.log('Request received:', req.method, req.url);

  try {
    const { email } = await req.json();
    
    if (!email) {
      console.log('Email is required but not provided');
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 10000) // 10 seconds timeout
    );

    const addDocPromise = addDoc(collection(db, 'waitlist'), {
      email,
      timestamp: serverTimestamp(),
    });

    await Promise.race([addDocPromise, timeoutPromise]);

    console.log('Successfully added to the waitlist');
    return NextResponse.json({ message: 'Successfully added to the waitlist!' }, { status: 200 });

  } catch (error) {
    const err = error as Error;
    console.error('Error adding to waitlist:', err.message || err);
    const status = err.message === 'Request timed out' ? 504 : 500;
    return NextResponse.json({ message: 'Failed to join the waitlist. Please try again.' }, { status });
  }
}