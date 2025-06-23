import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import ZenithLogo from '../ui/logo';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthenticator, setShowAuthenticator] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      router.push('/beta');
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMain = () => {
    window.location.href = '/';
  };

  const handleSignIn = () => {
    setShowAuthenticator(true);
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
  if (isLoading) {
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

  // User is authenticated - redirect
  if (isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center text-green-200">
            <h2 className="mb-2 text-lg font-semibold">Already Signed In</h2>
            <p className="text-sm">Redirecting to dashboard...</p>
            <button
              onClick={() => router.push('/beta')}
              className="mt-4 rounded-lg bg-[#33cc99] px-4 py-2 text-white hover:bg-[#33cc99]/80"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Authenticator modal
  if (showAuthenticator) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30"></div>

        {/* Close button */}
        <button
          onClick={() => setShowAuthenticator(false)}
          className="absolute right-6 top-6 z-50 text-white hover:text-gray-300"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Authenticator with custom styling */}
        <div className="w-full max-w-md">
          <style jsx global>{`
            .amplify-authenticator {
              --amplify-colors-background-primary: rgba(255, 255, 255, 0.1);
              --amplify-colors-background-secondary: rgba(255, 255, 255, 0.05);
              --amplify-colors-border-primary: rgba(255, 255, 255, 0.2);
              --amplify-colors-font-primary: white;
              --amplify-colors-font-secondary: rgba(255, 255, 255, 0.8);
              --amplify-colors-brand-primary-10: #33cc99;
              --amplify-colors-brand-primary-80: #33cc99;
              --amplify-colors-brand-primary-90: #124dff;
              border-radius: 1rem;
              backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .amplify-button--primary {
              background: linear-gradient(135deg, #33cc99, #124dff);
              border: none;
              border-radius: 0.75rem;
              font-weight: 500;
              transition: all 0.2s;
            }

            .amplify-button--primary:hover {
              transform: scale(1.02);
              opacity: 0.9;
            }

            .amplify-input {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 0.5rem;
              color: white;
              backdrop-filter: blur(8px);
            }

            .amplify-input:focus {
              border-color: #33cc99;
              box-shadow: 0 0 0 2px rgba(51, 204, 153, 0.3);
            }

            .amplify-tabs-item {
              color: rgba(255, 255, 255, 0.7);
            }

            .amplify-tabs-item[data-state='active'] {
              color: white;
              border-bottom-color: #33cc99;
            }
          `}</style>

          <Authenticator
            signUpAttributes={['email']}
            socialProviders={['google']}
            variation="modal"
            hideSignUp={false}
            components={{
              Header() {
                return (
                  <div className="mb-6 text-center">
                    <ZenithLogo />
                    <h2 className="mt-4 text-lg font-semibold text-white">
                      Welcome to the future of coding
                    </h2>
                    <p className="mt-2 text-sm text-white/80">
                      Sign in to access your coding challenges
                    </p>
                  </div>
                );
              },
              Footer() {
                return (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-white/50">
                      Secure authentication powered by AWS Cognito
                    </p>
                  </div>
                );
              },
            }}
          >
            {({ signOut, user }) => {
              // User is authenticated, redirect to beta
              router.push('/beta');
              return (
                <div className="text-center text-white">
                  <h2 className="mb-2 text-lg font-semibold">Welcome!</h2>
                  <p className="mb-4 text-sm">
                    Redirecting to your dashboard...
                  </p>
                </div>
              );
            }}
          </Authenticator>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
      {/* Gradient overlay with reduced opacity */}
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
          <div className="flex-column mb-8 justify-center text-center">
            <div className="mb-4 flex justify-center">
              <ZenithLogo />
            </div>
            <p className="mb-4 text-lg font-semibold text-white">
              Welcome to the future of coding
            </p>
            <p className="text-sm text-white/80">
              Sign in to access your coding challenges
            </p>
          </div>

          <div className="space-y-4">
            {/* Sign-In Button */}
            <button
              type="button"
              className="flex w-full transform items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
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
