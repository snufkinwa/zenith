'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import Login from '@/components/login';

export default function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get current user from Amplify
      await getCurrentUser();
      setIsAuthenticated(true);

      // Redirect if authenticated
      const destination = redirectTo || '/beta';
      router.replace(destination);
    } catch (error: any) {
      // User is not authenticated
      setIsAuthenticated(false);

      // Only set error if it's not just "not signed in"
      if (error.name !== 'UserUnAuthenticatedError') {
        setError(error.message || 'Authentication error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-red-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold">Authentication Error</h2>
          <p className="mb-4 text-sm text-red-300">{error}</p>
          <button
            onClick={checkAuthStatus}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If authenticated, return null (will redirect via useEffect)
  if (isAuthenticated) {
    return null;
  }

  // Show login page
  return (
    <>
      {redirectTo && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform rounded-lg border border-yellow-500/30 bg-yellow-500/20 px-4 py-2 text-yellow-100 backdrop-blur-sm">
          Please log in to access this page
        </div>
      )}
      <Login />
    </>
  );
}
