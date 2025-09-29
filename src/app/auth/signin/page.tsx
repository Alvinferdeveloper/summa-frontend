
'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button 
        onClick={() => signIn('google', { callbackUrl: '/profile' })} 
        style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
