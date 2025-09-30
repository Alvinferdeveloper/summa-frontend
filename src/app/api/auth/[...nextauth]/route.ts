import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, Session, Account, User } from "next-auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    error?: string;
    role?: string;
    userId?: string;
    employerId?: string;
    onboardingCompleted?: boolean;
  }
}

interface BackendTokenResponse {
  accessToken: string;
  onboarding_completed?: boolean; // Optional for employer login
}

interface DecodedBackendToken {
  user_id?: string;
  employer_id?: string;
  role: string;
  onboarding_completed?: boolean;
  exp: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post<BackendTokenResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/employer/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const { accessToken } = response.data;

          if (accessToken) {
            const decodedToken = jwtDecode<DecodedBackendToken>(accessToken);

            return {
              id: decodedToken.employer_id || decodedToken.user_id || "",
              email: credentials?.email,
              role: decodedToken.role,
              backendToken: accessToken,
            };
          }
          return null;
        } catch (error: any) {
          console.error("Employer login failed:", error.response?.data || error.message);
          throw new Error(error.response?.data?.error || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User | null;
      account?: Account | null;
      trigger?: "signIn" | "signUp" | "update";
      session?: any;
    }) {
      // Initial sign-in (Google or Credentials)
      if (account && user) {
        // If Google Provider
        if (account.provider === "google") {
          try {
            const response = await axios.post<BackendTokenResponse>(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/callback`,
              {
                provider: account.provider,
                provider_id: user.id,
                email: user.email,
              }
            );

            token.backendToken = response.data.accessToken;
            token.onboardingCompleted = response.data.onboarding_completed;

            // Decode to get role and userId
            const decodedToken = jwtDecode<DecodedBackendToken>(response.data.accessToken);
            token.role = decodedToken.role;
            token.userId = decodedToken.user_id;

            return token;
          } catch (error) {
            console.error("Error during Google backend token exchange:", error);
            token.error = "SignInError";
            return token;
          }
        }
        // If Credentials Provider
        if (account.provider === "credentials" && user.backendToken) {
          token.backendToken = user.backendToken as string;
          // Decode to get role and employerId
          const decodedToken = jwtDecode<DecodedBackendToken>(user.backendToken as string);
          token.role = decodedToken.role;
          token.employerId = decodedToken.employer_id;
          return token;
        }
      }

      // Handle client-side session updates (e.g., after onboarding form submission)
      if (trigger === "update" && session) {
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        return token;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      // Pass the backend token and custom claims to the client-side session.
      if (token.backendToken) {
        session.accessToken = token.backendToken as string;
      }
      if (token.onboardingCompleted !== undefined) {
        session.onboardingCompleted = token.onboardingCompleted;
      }
      if (token.role) {
        session.role = token.role;
      }
      if (token.userId) {
        session.userId = token.userId;
      }
      if (token.employerId) {
        session.employerId = token.employerId;
      }
      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

