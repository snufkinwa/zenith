import { Suspense } from 'react';
import LoginContent from './LoginContent';
import AuthTest from '@/components/AuthTest';

export default function LoginPage() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30">
      <Suspense fallback={<LoginLoadingFallback />}>
      <AuthTest />
      </Suspense>
    </div>
  );
}

function LoginLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <p>Loading...</p>
      </div>
    </div>
  );
}
