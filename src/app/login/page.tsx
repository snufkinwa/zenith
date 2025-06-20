import { Suspense } from 'react';
import LoginContent from './LoginContent';

export default function LoginPage() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#33cc99]/30 to-[#124dff]/30">
      <Suspense fallback={<LoginLoadingFallback />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}

function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p>Loading...</p>
      </div>
    </div>
  );
}

