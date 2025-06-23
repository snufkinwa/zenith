// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutWithNav from './layoutwithnav';
import { ThemeProvider } from 'next-themes';
import AmplifyProvider from '@/components/AmplifyProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '𝖹 𝖤 𝖭 𝖨 𝖳 𝖧',
  description: 'Experiment with Langchain and AI Models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LayoutWithNav>{children}</LayoutWithNav>
          </ThemeProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
