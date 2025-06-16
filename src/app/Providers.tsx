// Providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
const [supabaseClient] = useState(() =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionContextProvider>
  );
}
