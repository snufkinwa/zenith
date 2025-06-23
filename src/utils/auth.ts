'use client';

import { useState, useEffect } from 'react';
import {
  getCurrentUser,
  signOut as amplifySignOut,
  signInWithRedirect,
} from 'aws-amplify/auth';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  provider: string;
}

export function useAuthHelpers() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(mapUser(currentUser));
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const signInWithProvider = async (provider: 'Google') => {
    try {
      await signInWithRedirect({ provider });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const mapUser = (authUser: any): User => ({
    id: authUser.userId,
    email: authUser.signInDetails?.loginId || null,
    name: authUser.signInDetails?.loginId || null,
    avatar_url: null, // Get from Profile model
    provider: 'cognito',
  });

  return {
    user,
    loading,
    signInWithProvider,
    signOut,
    refreshAuth: checkAuthState,
  };
}
