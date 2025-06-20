'use client';

import { useSearchParams } from 'next/navigation';
import Login from '@/components/login';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const { signInWithProvider, user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      const destination = redirectTo || '/beta';
      router.replace(destination);
    }
  }, [user, loading, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      {redirectTo && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500/20 text-yellow-100 px-4 py-2 rounded-lg border border-yellow-500/30 z-50">
          Please log in to access this page
        </div>
      )}
      <Login signInWithProvider={signInWithProvider} />
    </>
  );
}