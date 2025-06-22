'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from 'react-oidc-context';

interface Props {
  children: React.ReactNode;
}

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI!,
  response_type: "code",
  scope: "email openid phone profile",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider {...cognitoAuthConfig}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}