import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'SHIFA Health OS — Un Patient, Un Dossier, Un Écosystème',
  description: 'SHIFA Health OS connecte patients, professionnels et établissements autour d\'un dossier de santé sécurisé et d\'une architecture modulaire mondiale.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fshifa1387back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}