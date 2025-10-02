
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import QueryProvider from './QueryProvider';
import { Toaster } from 'sonner'; // Import Sonner's Toaster

interface Props {
  children: React.ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
      <Toaster richColors position="top-right" /> {/* Add Sonner's Toaster here */}
    </SessionProvider>
  );
}
