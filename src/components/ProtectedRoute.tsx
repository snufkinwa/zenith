// src/components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  fallback 
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, error, refreshAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHandlingCallback, setIsHandlingCallback] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const hasOAuthParams = searchParams.get('code') || searchParams.get('error');
      
      if (hasOAuthParams) {
        setIsHandlingCallback(true);
        // Wait a moment for OAuth to complete
        setTimeout(async () => {
          await refreshAuth();
          setIsHandlingCallback(false);
        }, 2000);
        return;
      }
      
      if (!isLoading && !isAuthenticated && !isHandlingCallback) {
        router.push('/login');
      }
    };
    
    handleOAuthCallback();
  }, [isLoading, isAuthenticated, router, searchParams, refreshAuth, isHandlingCallback]);

  // Show loading state
  if (isLoading || isHandlingCallback) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center text-black">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/30 border-t-white" />
            <p>{isHandlingCallback ? 'Completing sign in...' : 'Checking authentication...'}</p>
          </div>
        </div>
      )
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold">Authentication Error</h2>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // User is not authenticated - redirect will happen via useEffect
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated - render children
  return <>{children}</>;
}