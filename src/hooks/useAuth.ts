'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  provider: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ? mapUser(session.user) : null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ? mapUser(session.user) : null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithProvider = async (provider: 'github' | 'google' | 'discord') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/beta`,
      },
    });

    if (error) throw new Error(error.message);
    if (data.url) window.location.href = data.url;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const mapUser = (authUser: any): User => ({
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
    avatar_url: authUser.user_metadata?.avatar_url || null,
    provider: authUser.app_metadata?.provider || 'unknown',
  });

  return {
    user,
    loading,
    signInWithProvider,
    signOut,
  };
}