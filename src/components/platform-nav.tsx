// src/components/platform-nav/index.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Code, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  BookOpen,
  Trophy,
  Target
} from 'lucide-react';

interface PlatformNavProps {
  isCollapsed?: boolean;
}

const PlatformNav: React.FC<PlatformNavProps> = ({ isCollapsed = false }) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    {
      name: 'Problems',
      href: '/problems',
      icon: BookOpen,
      active: pathname.startsWith('/problems')
    },
    {
      name: 'Code Environment',
      href: '/beta',
      icon: Code,
      active: pathname.startsWith('/beta')
    },
  ];

  const bottomItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      active: pathname === '/profile'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings'
    }
  ];

  const NavItem = ({ item, showLabel = true }: { item: any; showLabel?: boolean }) => (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        item.active
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? item.name : ''}
    >
      <item.icon size={20} />
      {showLabel && !isCollapsed && (
        <span className="font-medium">{item.name}</span>
      )}
    </Link>
  );

  return (
    <nav className="h-full flex flex-col">
      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-700">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
          
          {/* Logout Button */}
          <button
            onClick={() => {
              // Handle logout logic
              window.location.href = '/login';
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-red-600 hover:text-white ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PlatformNav;