'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function TestPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
