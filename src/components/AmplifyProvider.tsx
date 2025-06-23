// src/components/providers/AmplifyProvider.tsx
'use client';

import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import outputs from '../../amplify_outputs.json';
import { AuthProvider } from '@/contexts/AuthContext';

interface AmplifyProviderProps {
  children: React.ReactNode;
}

export default function AmplifyProvider({ children }: AmplifyProviderProps) {
  useEffect(() => {
    // Create a modified config without the problematic scope
    const cleanedOutputs = {
      ...outputs,
      auth: {
        ...outputs.auth,
        oauth: {
          ...outputs.auth.oauth,
          scopes: outputs.auth.oauth.scopes.filter(
            (scope: string) => scope !== 'aws.cognito.signin.user.admin'
          ),
        },
      },
    };

    // Configure Amplify with cleaned configuration
    Amplify.configure(cleanedOutputs);
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}