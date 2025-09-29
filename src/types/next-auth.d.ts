import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in session model to include our custom properties.
   */
  interface Session {
    accessToken?: string; // The custom JWT from our Go backend
    onboardingCompleted?: boolean;
    error?: string;
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