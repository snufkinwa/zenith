// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import LayoutWithNav from "./layoutwithnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "𝖹 𝖤 𝖭 𝖨 𝖳 𝖧",
  description: "Experiment with Langchain and AI Models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LayoutWithNav>
            {children}
          </LayoutWithNav>
        </Providers>
      </body>
    </html>
  );
}