import { supabaseServerClient } from '@utils/supabaseServerClient' 
import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data, error } = await supabaseServerClient
    .from('waitlist')
    .insert([{ email }]);
  
  if (error) {
    if (error.code === '23505') { 
      return NextResponse.json(
        { error: 'This email is already on the waitlist.' }, 
        { status: 409 } 
      );
    }
    throw error;
  }
    return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } 
  }
}