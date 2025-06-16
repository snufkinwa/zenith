// src/app/LayoutWithNav.tsx
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PlatformNav from '@/components/platform-nav';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface LayoutWithNavProps {
  children: React.ReactNode;
}

const LayoutWithNav: React.FC<LayoutWithNavProps> = ({ children }) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Pages that should show the navigation
  const pagesWithNav = ['/beta', '/dashboard', '/problems'];
  const shouldShowNav = pagesWithNav.some(page => pathname.startsWith(page));

  // Hide nav on login page or other auth pages
  const authPages = ['/login', '/signup', '/'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!shouldShowNav) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-row">
      {/* Collapsible Sidebar */}
      <aside 
        className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
          isNavCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse/Expand Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isNavCollapsed && (
            <div className="text-lg font-bold">
              𝖹 𝖤 𝖭 𝖨 𝖳 𝖧
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
        <div className="flex-1">
          <PlatformNav isCollapsed={isNavCollapsed} />
        </div>

        {/* Collapse State Indicator */}
        {isNavCollapsed && (
          <div className="p-2 text-center border-t border-gray-700">
            <Menu size={16} className="mx-auto text-gray-400" />
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default LayoutWithNav;