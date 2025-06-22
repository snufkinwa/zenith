'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/login';

export default function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const auth = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      const destination = redirectTo || '/beta';
      router.replace(destination);
    }
  }, [auth.isAuthenticated, auth.isLoading, redirectTo, router]);

  // Handle loading state
  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-red-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold">Authentication Error</h2>
          <p className="mb-4 text-sm text-red-300">{auth.error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If authenticated, return null (will redirect via useEffect)
  if (auth.isAuthenticated) {
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