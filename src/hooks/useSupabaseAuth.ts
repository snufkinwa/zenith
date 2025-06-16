import { useSession } from '@supabase/auth-helpers-react';
import { Provider } from '@supabase/supabase-js';

const useSupabaseAuth = () => {
  const session = useSession();

  const signIn = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const response = await fetch('/api/auth/sign-in-with-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
  
      const { url } = await response.json();
      if (!url) {
        throw new Error('No authentication URL returned');
      }
  
      window.location.href = url;
    } catch (error) {
      console.error('Sign in error:', error);
    
    }
  };

  const signOut = async () => {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
  };

  return { 
    user: session?.user, 
    signIn, 
    signInWithProvider, 
    signOut,
    session,
  };
};

export default useSupabaseAuth;
