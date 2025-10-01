
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const signInUrl = new URL('/auth/signin', req.url);
  const profileUrl = new URL('/profile', req.url);
  const employerDashboardUrl = new URL('/employer/dashboard', req.url);
  const homeUrl = new URL('/', req.url);

  const isAuthPage = pathname.startsWith('/auth/signin') || pathname.startsWith('/employer/login') || pathname.startsWith('/employer/register');

  if (!token) {
    if (!isAuthPage) {
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }
  const { role } = token;

  if (isAuthPage) {
    if (role === 'job_seeker') {
      return NextResponse.redirect(profileUrl);
    }
    if (role === 'employer') {
      return NextResponse.redirect(employerDashboardUrl);
    }
  }

  if (pathname.startsWith('/profile') && role !== 'job_seeker') {
    return NextResponse.redirect(homeUrl);
  }
  if (pathname.startsWith('/employer/dashboard') && role !== 'employer') {
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/employer/dashboard/:path*',
    '/auth/signin',
    '/employer/login',
    '/employer/register',
  ],
};
