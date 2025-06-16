import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import type { Provider } from '@supabase/supabase-js'

const useSupabaseAuth = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)
  }

  const signInWithProvider = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) throw new Error(error.message)
    if (data.url) window.location.href = data.url
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  return {
    user: session?.user,
    session,
    signIn,
    signInWithProvider,
    signOut,
  }
}

export default useSupabaseAuth
