import React, { useState } from 'react';

interface LoginProps {
  login: (formData: FormData) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  signInWithProvider: (provider: 'github' | 'discord' | 'google') => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ login, signup, signInWithProvider }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData(event.currentTarget);
    
    try {
      if (isSignUp) {
        await signup(formData);
      } else {
        await login(formData);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'discord' | 'google') => {
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error('Error signing in with provider:', error);
      setError(error instanceof Error ? error.message : 'OAuth sign-in failed');
      setIsLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'discord':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
          </svg>
        );
      case 'google':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
              𝖹 𝖤 𝖭 𝖨 𝖳 𝖧
            </h1>
            <p className="text-gray-300 text-lg">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                required
                disabled={isLoading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-violet-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="mx-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              className="bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading}
              aria-label="Sign in with GitHub"
            >
              {getProviderIcon('github')}
            </button>
            <button
              type="button"
              className="bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              onClick={() => handleOAuthSignIn('discord')}
              disabled={isLoading}
              aria-label="Sign in with Discord"
            >
              {getProviderIcon('discord')}
            </button>
            <button
              type="button"
              className="bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              aria-label="Sign in with Google"
            >
              {getProviderIcon('google')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-purple-300 hover:underline focus:outline-none"
              onClick={() => setIsSignUp((prev) => !prev)}
              disabled={isLoading}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;