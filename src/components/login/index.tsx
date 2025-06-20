import React, { useState, useEffect } from 'react';
import ZenithLogo from '../ui/logo';
import { ArrowLeft } from 'lucide-react';

interface LoginProps {
  signInWithProvider: (provider: 'github' | 'discord' | 'google') => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ signInWithProvider }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Firefox detection for input styling fixes
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    setIsFirefox(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
  }, []);

  const handleOAuthSignIn = async (provider: 'github' | 'discord' | 'google') => {
    setIsLoading(true);
    setLoadingProvider(provider);
    setError('');
    
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error('Error signing in with provider:', error);
      setError(error instanceof Error ? error.message : `${provider} sign-in failed`);
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleBackToMain = () => {
    window.location.href = '/';
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

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'github': return 'GitHub';
      case 'discord': return 'Discord';
      case 'google': return 'Google';
      default: return provider;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'github': return 'hover:bg-gray-700 focus:ring-gray-500';
      case 'discord': return 'hover:bg-indigo-600 focus:ring-indigo-500';
      case 'google': return 'hover:bg-red-600 focus:ring-red-500';
      default: return 'hover:bg-gray-600 focus:ring-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative">
      {/* Gradient overlay with reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>
      {/* Firefox-specific styles */}
      <style jsx>{`
        @supports (-moz-appearance: none) {
          .firefox-fix {
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
          }
        }
      `}</style>
      
      {/* Back to Main Site Button */}
      <button
        onClick={handleBackToMain}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Back to Home</span>
      </button>
      
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="text-center justify-center mb-8 flex-column">
          <div className="flex justify-center mb-4">
             <ZenithLogo />
            </div>
            <p className="text-white text-lg mb-4 font-semibold">
              Welcome to the future of coding
            </p>
            <p className="text-white/80 text-sm">
              Sign in with your preferred account to get started
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {(['github', 'google', 'discord'] as const).map((provider) => (
              <button
                key={provider}
                type="button"
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 
                  bg-white/5 border border-white/20 rounded-xl text-white font-medium
                  transition-all duration-200 transform hover:scale-[1.02] hover:bg-white/10
                  focus:outline-none focus:ring-2 focus:ring-[#33cc99]/50 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${getProviderColor(provider)} firefox-fix`}
                onClick={() => handleOAuthSignIn(provider)}
                disabled={isLoading}
              >
                {loadingProvider === provider ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  getProviderIcon(provider)
                )}
                <span className="text-lg">
                  {loadingProvider === provider 
                    ? `Connecting to ${getProviderName(provider)}...`
                    : `Continue with ${getProviderName(provider)}`
                  }
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center text-white/70 text-sm">
              <p>
                By signing in, you agree to our{' '}
                <a href="#" className="text-[#33cc99] hover:text-[#33cc99]/80 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#33cc99] hover:text-[#33cc99]/80 underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Powered by indicator */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              Secure authentication powered by OAuth 2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;