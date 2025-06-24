// src/app/beta/page.tsx - SUPER SIMPLE now!
'use client';

import { useEffect, useState, Suspense } from 'react';
import CodeEnvironment from '@/components/codeenviroment/CodeEnvironment';
import type { Problem } from '@/components/codeenviroment/CodeEnvironment';

function BetaPageContent() {
  // No more auth logic - handled by layout!
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const res = await fetch('/data/problems.json');
        if (!res.ok) throw new Error('Failed to fetch problems');
        const data = await res.json();
        setProblems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    loadProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <CodeEnvironment problems={problems} />;
}

export default function BetaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <BetaPageContent />
    </Suspense>
  );
}