import React, { useState } from 'react';
import styles from './login.module.css';

interface LoginProps {
  login: (formData: FormData) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  signInWithProvider: (provider: 'github' | 'discord' | 'google') => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ login, signup, signInWithProvider }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      if (isSignUp) {
        await signup(formData);
      } else {
        await login(formData);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'discord' | 'google') => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error('Error signing in with provider:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.header1}>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.signInButton}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <div className={styles.oauthButtons}>
        <button onClick={() => handleOAuthSignIn('github')}>Sign in with GitHub</button>
        <button onClick={() => handleOAuthSignIn('discord')}>Sign in with Discord</button>
        <button onClick={() => handleOAuthSignIn('google')}>Sign in with Google</button>
      </div>
      <button onClick={() => setIsSignUp(!isSignUp)} className={styles.toggleButton}>
        {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </button>
    </div>
  );
};

export default Login;