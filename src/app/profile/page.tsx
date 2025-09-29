
'use client';

import { useSession, signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Access Denied. Please sign in.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>Your email is: {session?.user?.email}</p>
      
      <details style={{ marginTop: '2rem', background: '#f0f0f0', padding: '1rem' }}>
        <summary>View Backend JWT</summary>
        <p style={{ wordBreak: 'break-all' }}>
          This is the JWT from your Go backend, which is now stored in the NextAuth session:
          <br />
          <strong>{session?.accessToken}</strong>
        </p>
      </details>

      <button 
        onClick={() => signOut({ callbackUrl: '/' })} 
        style={{ marginTop: '2rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Sign Out
      </button>
    </div>
  );
}
