'use client';

import { signInWithRedirect, signUp, signIn } from 'aws-amplify/auth';

export async function signInWithProvider(provider: 'Google') {
  try {
    await signInWithRedirect({ provider });
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    await signIn({
      username: email,
      password,
    });
    window.location.href = '/beta';
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function signup(email: string, password: string) {
  try {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: { email },
      },
    });
    window.location.href = '/auth/verify-email';
  } catch (error: any) {
    throw new Error(error.message);
  }
}
