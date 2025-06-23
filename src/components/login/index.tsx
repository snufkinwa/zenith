'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { signIn, signUp, getCurrentUser, signInWithRedirect } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import ZenithLogo from '../ui/logo';
import { ArrowLeft } from 'lucide-react';
// Amplify is configured in AmplifyProvider

interface SignInFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignInForm extends HTMLFormElement {
  readonly elements: SignInFormElements;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      router.push('/beta');
    } catch (error) {
      // User is not authenticated, show login form
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSubmit = async (event: FormEvent<SignInForm>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = event.currentTarget;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: { email },
          },
        });
        setError('Account created! Please check your email to verify your account, then sign in.');
        setIsSignUp(false);
      } else {
        await signIn({
          username: email,
          password,
        });
        router.push('/beta');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      switch (error.name) {
        case 'UserNotConfirmedException':
          setError('Please check your email and confirm your account first.');
          break;
        case 'NotAuthorizedException':
          setError('Invalid email or password.');
          break;
        case 'UserNotFoundException':
          setError('No account found with this email. Try creating an account.');
          break;
        case 'TooManyRequestsException':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'UsernameExistsException':
          setError('An account with this email already exists. Try signing in instead.');
          break;
        default:
          setError(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithRedirect({ provider: 'Google' });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError('Google sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToMain = () => {
    window.location.href = '/';
  };

  const getGoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            <span className="ml-3 text-white">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>

      {/* Back to Main Site Button */}
      <button
        onClick={handleBackToMain}
        className="group absolute left-6 top-6 flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <ZenithLogo />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-white/80">
              {isSignUp 
                ? 'Join the future of coding challenges' 
                : 'Sign in to access your coding challenges'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="mb-6 flex w-full transform items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {getGoogleIcon()}
            <span>Continue with Google</span>
          </button>

          <div className="mb-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-white/60">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:border-[#33cc99] focus:outline-none focus:ring-2 focus:ring-[#33cc99]/50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:border-[#33cc99] focus:outline-none focus:ring-2 focus:ring-[#33cc99]/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full transform rounded-lg bg-gradient-to-r from-[#33cc99] to-[#124dff] px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-[#33cc99] hover:text-[#33cc99]/80 underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/50">
              Secure authentication powered by AWS Cognito
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;