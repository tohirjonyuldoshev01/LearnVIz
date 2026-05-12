import React from 'react';
import { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SessionExpiredAlert } from '@/components/auth/SessionExpiredAlert';
// @ts-expect-error CSS module resolution
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'LearnViz - AI-Powered Visual Learning Platform',
  description: 'Create and explore interactive diagrams with AI assistance',
  keywords: 'learning, diagrams, AI, education, visual learning',
  authors: [{ name: 'LearnViz Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Full-screen background image — light mode */}
        <div
          className="fixed inset-0 bg-cover bg-center -z-10 dark:hidden"
          style={{ backgroundImage: "url('/images/Gemini_Generated_Image_4ym84l4ym84l4ym8.png')" }}
          aria-hidden="true"
        />
        {/* Full-screen background image — dark mode */}
        <div
          className="fixed inset-0 bg-cover bg-center -z-10 hidden dark:block"
          style={{ backgroundImage: "url('/images/Gemini_Generated_Image_d6kjfmd6kjfmd6kj.png')" }}
          aria-hidden="true"
        />
        {/* Semi-transparent overlay for readability */}
        <div
          className="fixed inset-0 bg-white/40 dark:bg-black/30 -z-10"
          aria-hidden="true"
        />
        <AuthProvider>
          <LanguageProvider>
            <SessionExpiredAlert />
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
