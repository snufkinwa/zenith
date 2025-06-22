import { NextRequest, NextResponse } from 'next/server';
import { generateHint } from '@/lib/ai-hints';

export async function POST(req: NextRequest) {
  try {
    const { query, context = '', useWebSearch = false } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 },
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 },
      );
    }

    // Use existing generateHint function
    const hint = await generateHint(query, context, useWebSearch);

    return NextResponse.json({ hint });
  } catch (error: any) {
    console.error('Hints API error:', error);

    // Return a more helpful error message
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate hint',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
