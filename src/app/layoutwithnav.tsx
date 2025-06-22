'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import PlatformNav from '@/components/platform-nav';
import { PomodoroProvider } from '@/contexts/PomodoroContext'; // Add this import
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Logo from '@/components/ui/logo';

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

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!shouldShowNav) {
    return <>{children}</>;
  }

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
        </aside>

        {/* Main Content */}
        <main className="h-full flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </PomodoroProvider>
  );
};

export default LayoutWithNav;
