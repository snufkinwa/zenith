// src/app/beta/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import CodeEnvironment from '@/components/codeenviroment/CodeEnvironment';

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string | null;
  content: string;
}

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
        setError(err instanceof Error ? err.message : 'Failed to load problems');
        console.error('Error loading problems:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
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
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <BetaPageContent />
    </Suspense>
  );
}