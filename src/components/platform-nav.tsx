'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Code, LogOut, BookOpen, Video } from 'lucide-react';

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
      active: pathname === '/dashboard',
    },
    {
      name: 'Problems',
      href: '/problems',
      icon: BookOpen,
      active: pathname.startsWith('/problems'),
    },
    {
      name: 'Code Environment',
      href: '/beta',
      icon: Code,
      active: pathname.startsWith('/beta'),
    },
  ];

  const NavItem = ({
    item,
    showLabel = true,
  }: {
    item: any;
    showLabel?: boolean;
  }) => (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
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
    <nav className="flex h-full flex-col">
      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-700 px-3 py-4">
        <div className="space-y-1">
          {/* Logout Button */}
          <form action="/auth/signout" method="post" className="w-full">
            <button
              type="submit"
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-red-600 hover:text-white ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default PlatformNav;
