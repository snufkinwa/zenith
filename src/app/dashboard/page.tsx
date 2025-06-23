'use client';

import Dashboard from '@/components/dashboard/dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LoginPage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
}
