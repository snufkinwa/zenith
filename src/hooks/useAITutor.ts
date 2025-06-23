'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export function useAITutor() {
  const [loading, setLoading] = useState(false);

  const getHint = async (
    query: string,
    context?: string,
    problemTitle?: string,
  ) => {
    try {
      setLoading(true);

      // Call your Lambda function via Amplify
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          context: context || '',
          problemTitle: problemTitle || '',
        }),
      });

      const result = await response.json();
      return result.response || "Sorry, I couldn't generate a hint right now.";
    } catch (error) {
      console.error('AI Tutor error:', error);
      return "Sorry, I couldn't generate a hint right now.";
    } finally {
      setLoading(false);
    }
  };

  return {
    getHint,
    loading,
  };
}
