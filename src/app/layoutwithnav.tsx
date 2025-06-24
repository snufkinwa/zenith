// LayoutWithNav.tsx - SIMPLE wrapper approach
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import PlatformNav from '@/components/platform-nav';
import { PomodoroProvider } from '@/contexts/PomodoroContext';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Logo from '@/components/ui/logo';
import outputs from '../../amplify_outputs.json';

// Configure Amplify
Amplify.configure(outputs);

interface LayoutWithNavProps {
  children: React.ReactNode;
}

const LayoutWithNav: React.FC<LayoutWithNavProps> = ({ children }) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const pathname = usePathname();
  
  const pagesWithNav = ['/beta', '/dashboard', '/problems'];
  const shouldShowNav = pagesWithNav.some((page) => pathname.startsWith(page));
  const authPages = ['/login', '/signup', '/'];
  const isAuthPage = authPages.includes(pathname);

  // Return auth pages without authentication
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Return other pages without nav
  if (!shouldShowNav) {
    return <>{children}</>;
  }

  // For protected pages, wrap with Authenticator
  return (
    <Authenticator
      socialProviders={['google']}
      components={{
        Header() {
          return (
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Sign in to Zenith</h2>
            </div>
          );
        }
      }}
    >
      {({ signOut, user }) => {
        // If no user, show loading (Authenticator will handle login)
        if (!user) {
          return (
            <div className="flex h-screen items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          );
        }

        // User is authenticated, show the full layout
        return (
          <PomodoroProvider>
            <div className="flex h-screen flex-row overflow-hidden">
              {/* Sidebar */}
              <aside
                className={`flex h-full flex-col bg-gray-900 text-white transition-all duration-300 ${
                  isNavCollapsed ? 'w-16' : 'w-64'
                }`}
              >
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-700 p-4">
                  {!isNavCollapsed && (
                    <div className="w-12 text-lg font-bold">
                      <Logo />
                    </div>
                  )}
                  <button
                    onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                    className="rounded-md p-2 transition-colors hover:bg-gray-700"
                    title={isNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    {isNavCollapsed ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronLeft size={16} />
                    )}
                  </button>
                </div>

                {/* Navigation Content */}
                <div className="min-h-0 flex-1">
                  <PlatformNav isCollapsed={isNavCollapsed} />
                </div>

                {/* User Info & Sign Out */}
                <div className="border-t border-gray-700 p-4">
                  {!isNavCollapsed && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-300">
                        {user.signInDetails?.loginId || user.username}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={signOut}
                    className="w-full rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    title="Sign out"
                  >
                    {isNavCollapsed ? '⏻' : 'Sign Out'}
                  </button>
                </div>
              </aside>

              {/* Main Content */}
              <main className="h-full flex-1 overflow-hidden bg-gray-50">
                {children}
              </main>
            </div>
          </PomodoroProvider>
        );
      }}
    </Authenticator>
  );
};

export default LayoutWithNav;