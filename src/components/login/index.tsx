import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import ZenithLogo from '../ui/logo';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const auth = useAuth();
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    setIsFirefox(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
  }, []);

  const handleBackToMain = () => {
    window.location.href = '/';
  };

  const handleSignIn = () => {
    auth.signinRedirect();
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

  // Show loading state
  if (auth.isLoading) {
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

  // Show error state
  if (auth.error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center text-red-200">
            <h2 className="mb-2 text-lg font-semibold">Authentication Error</h2>
            <p className="text-sm">{auth.error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated - this shouldn't show on login page
  // but good to handle the case
  if (auth.isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center text-green-200">
            <h2 className="mb-2 text-lg font-semibold">Already Signed In</h2>
            <p className="text-sm">Welcome, {auth.user?.profile.email}</p>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="mt-4 rounded-lg bg-[#33cc99] px-4 py-2 text-white hover:bg-[#33cc99]/80"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
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
        className="group absolute left-6 top-6 flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex-column mb-8 justify-center text-center">
            <div className="mb-4 flex justify-center">
              <ZenithLogo />
            </div>
            <p className="mb-4 text-lg font-semibold text-white">
              Welcome to the future of coding
            </p>
            <p className="text-sm text-white/80">
              Sign in with Google to access your coding challenges
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Sign-In Button */}
            <button
              type="button"
              className="flex w-full transform items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 hover:bg-red-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 firefox-fix"
              onClick={handleSignIn}
            >
              {getGoogleIcon()}
              <span className="text-lg">Continue with Google</span>
            </button>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="text-center text-sm text-white/70">
              <p>
                By signing in, you agree to our{' '}
                <a
                  href="#"
                  className="text-[#33cc99] underline hover:text-[#33cc99]/80"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-[#33cc99] underline hover:text-[#33cc99]/80"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Powered by indicator */}
          <div className="mt-6 text-center">
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