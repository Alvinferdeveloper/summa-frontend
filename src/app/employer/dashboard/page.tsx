"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function EmployerDashboardPage() {
  const { data: session, status } = useSession();
  const [employerInfo, setEmployerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.role === 'employer') {
      setEmployerInfo({ message: `Welcome, Employer ${session.employerId}!` });
      setLoading(false);
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/employer/login' });
  };

  if (status === 'loading' || loading) {
    return <div style={{ padding: '2rem' }}>Loading employer dashboard...</div>;
  }

  if (status === 'authenticated' && session?.role === 'employer') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Employer Dashboard</h1>
        {employerInfo && <p>{employerInfo.message}</p>}
        <button
          onClick={handleLogout}
          style={{ marginTop: '2rem', padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    );
  }

  return null;
}
