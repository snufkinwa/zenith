'use client';

import { useState, useEffect, Suspense } from 'react';
import CodeEnvironment from '@/components/codeenviroment/CodeEnvironment';
import type { Problem } from '@/components/codeenviroment/CodeEnvironment';

function BetaPageContent() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        // Load problems from your data source
        const response = await fetch('/data/problems.json');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const problemsData = await response.json();
        setProblems(problemsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load problems',
        );
        console.error('Error loading problems:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No problems available</p>
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
