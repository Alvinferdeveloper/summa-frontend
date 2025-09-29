import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, Session, Account, User } from "next-auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface BackendToken {
  accessToken: string;
}

interface DecodedBackendToken {
  user_id: number;
  role: string;
  onboarding_completed: boolean;
  exp: number;
  iat: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/callback`,
            {
              provider: account.provider,
              provider_id: user.id,
              email: user.email,
            }
          );

          const backendToken = response.data as BackendToken;
          const decodedToken = jwtDecode<DecodedBackendToken>(backendToken.accessToken);

          token.backendToken = backendToken.accessToken;
          token.onboardingCompleted = decodedToken.onboarding_completed;
          return token;

        } catch (error) {
          console.error("Error during backend token exchange:", error);
          token.error = "SignInError";
          return token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.backendToken) {
        session.accessToken = token.backendToken;
      }
      if (token.error) {
        session.error = token.error as string;
      }
      session.onboardingCompleted = token.onboardingCompleted;
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

