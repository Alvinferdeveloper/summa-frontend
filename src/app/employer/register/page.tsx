
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployerRegistration } from '@/app/employer/hooks/useEmployerRegistration';
import { useSession, signIn } from 'next-auth/react';

export default function EmployerRegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  const { mutate, isPending, isSuccess, error } = useEmployerRegistration();

  useEffect(() => {
    if (status === 'authenticated' && session?.role === 'employer') {
      router.push('/employer/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (isSuccess) {
      // After successful registration, attempt to sign in the user immediately
      signIn('credentials', {
        email,
        password,
        redirect: false, // Do not redirect, handle it manually
      }).then((result) => {
        if (result?.error) {
          console.error("Auto-login after registration failed:", result.error);
          // Optionally, redirect to login page with an error message
          router.push('/employer/login?error=AutoLoginFailed');
        } else if (result?.ok) {
          // If auto-login is successful, useEffect for session status will handle redirection
          console.log("Auto-login after registration successful.");
        }
      });
    }
  }, [isSuccess, email, password, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ company_name: companyName, email, password });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Employer Registration</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
        <button type="submit" disabled={isPending} style={{ padding: '0.8rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>Already have an account? <a href="/employer/login" style={{ color: '#007bff' }}>Login here</a></p>
    </div>
  );
}
