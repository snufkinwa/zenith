"use client";

import { ThemeProvider } from 'next-themes';
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { MovexProvider } from 'movex-react';
import movexConfig from '../movex.config';

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
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <SessionContextProvider supabaseClient={supabaseClient}>
      <MovexProvider movexDefinition={movexConfig} endpointUrl="localhost:3333">
        {children}
       </MovexProvider>
    </SessionContextProvider> 
    </ThemeProvider>
  );
}
