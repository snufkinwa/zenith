'use client';

import { useAuth } from '@/contexts/AuthContext';
import { sessionAPI } from '@/utils/appSyncClient';

export function useAuthenticatedAPI() {
  const { isAuthenticated, user } = useAuth();

  const createSession = async (sessionData: any) => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to create a session');
    }
    
    return sessionAPI.createSession({
      ...sessionData,
      userId: user.userId,
    });
  };

  const getSession = async (sessionId: string) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to get session');
    }
    
    return sessionAPI.getSession(sessionId);
  };

  const updateSession = async (sessionId: string, updates: any) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to update session');
    }
    
    return sessionAPI.updateSession(sessionId, updates);
  };

  return {
    createSession,
    getSession,
    updateSession,
    isAuthenticated,
    user,
  };
}