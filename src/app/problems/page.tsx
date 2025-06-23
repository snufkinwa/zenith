'use client';

import ProblemsPage from '@/components/ProblemsListPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <ProblemsPage />
    </ProtectedRoute>
  );
}
