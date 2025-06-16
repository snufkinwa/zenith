'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/supabaseServerClient'

function getBaseUrl() {
  // For development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // For production - try multiple environment variables
  return process.env.NEXT_PUBLIC_SITE_URL || 
         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
         'http://localhost:3000'
}

export async function signInWithProvider(provider: 'github' | 'discord' | 'google') {
  const supabase = createClient()
  const redirectUrl = `${getBaseUrl()}/auth/callback?next=/beta`
  
  console.log('OAuth redirect URL:', redirectUrl) // Debug log
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    console.error(`${provider} OAuth error:`, error)
    throw new Error(`${provider} sign-in failed: ${error.message}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/beta')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback?next=/beta`,
    },
  })

  if (error) {
    console.error('Signup error:', error)
    throw new Error(error.message)
  }

  // For email signup, don't redirect immediately - user needs to verify email
  redirect('/auth/verify-email')
}