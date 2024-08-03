import React from 'react';
import { useRouter } from 'next/navigation';  // Changed from next/router
import useSupabaseAuth from '@hooks/useSupabaseAuth';
import styles from './login.module.css';

const Login: React.FC = () => {
  const router = useRouter();  // Using useRouter from next/navigation
  const { user, signIn, signInWithProvider, signOut } = useSupabaseAuth();

  const handleEmailSignIn = async () => {
    try {
      await signIn('your-email@example.com', 'your-password');
      router.push('/beta');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signing in:', error.message);
      }
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'discord' | 'google') => {
    try {
      await signInWithProvider(provider);
      router.push('/beta');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signing in with provider:', error.message);
      }
    }
  };

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      {!user ? (
        <>
          <button onClick={handleEmailSignIn}>Sign in with Email</button>
          <button onClick={() => handleOAuthSignIn('github')}>Sign in with GitHub</button>
          <button onClick={() => handleOAuthSignIn('discord')}>Sign in with Discord</button>
          <button onClick={() => handleOAuthSignIn('google')}>Sign in with Google</button>
        </>
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      )}
    </div>
  );
};

export default Login;