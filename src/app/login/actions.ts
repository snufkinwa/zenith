'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/supabaseServerClient'

export async function signInWithProvider(provider: 'github' | 'discord' | 'google') {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/beta`, // Add ?next=/beta
    },
  });

  if (error) {
    console.error('OAuth sign-in error:', error.message);
    throw new Error(`${provider} sign-in failed: ${error.message}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

// Also update regular login/signup to redirect to beta:
export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email');
  const password = formData.get('password');
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid form input');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  
  redirect('/beta') 
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/beta`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/beta') 
}