import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await axios.post(
      'https://emkc.org/api/v2/piston/execute',
      body,
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error('Piston error:', err.message);
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}
