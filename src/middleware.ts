import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const signInUrl = new URL('/auth/signin', req.url);
  const jobsUrl = new URL('/jobs', req.url);
  const employerDashboardUrl = new URL('/employer/dashboard', req.url);
  const adminLoginUrl = new URL('/admin/login', req.url);
  const adminDashboardUrl = new URL('/admin/dashboard', req.url);
  const homeUrl = new URL('/', req.url);

  const isAuthPage = pathname.startsWith('/auth/signin') || pathname.startsWith('/employer/login') || pathname.startsWith('/employer/register') || pathname.startsWith('/admin/login');
  console.log(token,isAuthPage)
  if (!token) {
    if (!isAuthPage) {
      return NextResponse.redirect(signInUrl);
    }
    console.log("no token")
    return NextResponse.next();
  }

  const { role } = token;

  if (isAuthPage) {
    if (role === 'job_seeker') {
      return NextResponse.redirect(jobsUrl);
    }
    if (role === 'employer') {
      return NextResponse.redirect(employerDashboardUrl);
    }
    if (role === 'admin' && pathname !== '/admin/login') {
      return NextResponse.redirect(adminDashboardUrl);
    }
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (token && token.role === 'admin') {
        return NextResponse.redirect(adminDashboardUrl);
      }
      return NextResponse.next();
    }
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(adminLoginUrl);
    }
    return NextResponse.next();
  }


  if (pathname.startsWith('/profile') && role !== 'job_seeker') {
    return NextResponse.redirect(homeUrl);
  }
  if (pathname.startsWith('/employer/dashboard') && role !== 'employer') {
    return NextResponse.redirect(homeUrl);
  }

  console.log("jjaja")
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/employer/dashboard/:path*',
    '/employer/:path*',
    '/auth/signin',
    '/admin/:path*',
  ],
};