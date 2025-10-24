
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import QueryProvider from './QueryProvider';
import { Toaster } from 'sonner';
import { WebSocketProvider } from '@/app/features/chat/context/WebSocketContext';

interface Props {
  children: React.ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <SessionProvider>
      <QueryProvider>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </QueryProvider>
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
