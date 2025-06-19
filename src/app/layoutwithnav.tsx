"use client";

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
  const shouldShowNav = pagesWithNav.some(page => pathname.startsWith(page));
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
      <div className="h-screen flex flex-row overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-gray-900 text-white flex flex-col h-full transition-all duration-300 ${
            isNavCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            {!isNavCollapsed && (
              <div className="text-lg font-bold w-12">
                <Logo />
              </div>
            )}
            <button
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors"
              title={isNavCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isNavCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 min-h-0">
            <PlatformNav isCollapsed={isNavCollapsed} />
          </div>

          {/* Collapse Indicator */}
          {isNavCollapsed && (
            <div className="p-2 text-center border-t border-gray-700 flex-shrink-0">
              <Menu size={16} className="mx-auto text-gray-400" />
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </PomodoroProvider>
  );
};

export default LayoutWithNav;