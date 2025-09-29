
'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import QueryProvider from './QueryProvider';

interface Props {
  children: React.ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}
