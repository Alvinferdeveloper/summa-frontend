import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in session model to include our custom properties.
   */
  interface Session {
    accessToken?: string;
    error?: string;
    role?: string;
    userId?: string;
    employerId?: string;
    onboardingCompleted?: boolean;
  }
  interface User {
    id: string;
    role?: string;
    backendToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT model.
   */
  interface JWT {
    backendToken?: string; // The custom JWT from our Go backend
    onboardingCompleted?: boolean;
  }
}
