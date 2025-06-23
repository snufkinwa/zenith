'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, AuthUser, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  client: ReturnType<typeof generateClient<Schema>> | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ReturnType<typeof generateClient<Schema>> | null>(null);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const session = await fetchAuthSession();
      
      if (session.tokens) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        const authenticatedClient = generateClient<Schema>();
        setClient(authenticatedClient);
      } else {
        setUser(null);
        setClient(null);
      }
      
    } catch (error: any) {
      console.log('User not authenticated:', error.name);
      setUser(null);
      setClient(null);
      
      if (error.name !== 'UserUnAuthenticatedError' && error.name !== 'NotAuthorizedException') {
        setError(error.message || 'Authentication error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    await checkAuthState();
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    client,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected API calls
export function useAuthenticatedClient() {
  const { client, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !client) {
    throw new Error('User must be authenticated to use this client');
  }
  
  return client;
}