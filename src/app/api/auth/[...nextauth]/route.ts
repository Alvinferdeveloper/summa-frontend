import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, Session, Account, User } from "next-auth";
import axios from "axios";

// Extend the NextAuth interfaces to include our custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    onboardingCompleted?: boolean;
  }
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    error?: string;
    onboardingCompleted?: boolean;
  }
}

interface BackendToken {
  accessToken: string;
  onboarding_completed: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      // Initial sign-in: fetch backend token and onboarding status
      if (account && user) {
        try {
          const response = await axios.post<BackendToken>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/callback`,
            {
              provider: account.provider,
              provider_id: user.id,
              email: user.email,
            }
          );
          
          token.backendToken = response.data.accessToken;
          token.onboardingCompleted = response.data.onboarding_completed;
          return token;
        } catch (error) {
          console.error("Error during backend token exchange:", error);
          token.error = "SignInError";
          return token;
        }
      }

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
      if (token.backendToken) {
        session.accessToken = token.backendToken as string;
      }
      if (token.onboardingCompleted !== undefined) {
        session.onboardingCompleted = token.onboardingCompleted;
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

