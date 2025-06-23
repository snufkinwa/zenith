'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signInWithRedirect, fetchAuthSession } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';

export default function AuthTest() {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        setSessionInfo(`Tokens: ${!!session.tokens}, Identity: ${!!session.identityId}`);
      } catch (err) {
        setSessionInfo('No session');
      }
    };
    checkSession();
  }, [isAuthenticated]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading auth...</div>;
  }

  if (error) {
    return <div className="text-red-400">Auth Error: {error}</div>;
  }

  return (
    <div className="text-white space-y-2">
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>Session: {sessionInfo}</p>
      {user && <p>User ID: {user.userId}</p>}
      {!isAuthenticated && (
        <button 
          onClick={handleGoogleSignIn}
          className="mt-2 bg-blue-600 px-4 py-2 rounded text-white"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}