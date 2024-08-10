'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/supabaseServerClient'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email');
  const password = formData.get('password');
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid form input');
  }
  
  const data = {
    email,
    password,
  };
  
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/beta') 
  redirect('/beta') 
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/beta') 
  redirect('/beta') 
}


export async function signInWithProvider(provider: 'github' | 'discord' | 'google') {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // Change this to the correct redirect URL
    },
  });

  if (error) {
    console.error('OAuth sign-in error:', error.message);
    redirect('/error')
  }

revalidatePath('/beta') 
redirect('/beta') 
}