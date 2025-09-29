import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, Session, Account, User } from "next-auth";
import axios from "axios";

interface BackendToken {
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt(
      { token, user, account }: {
        token: JWT;
        user?: User | null;
        account?: Account | null;
      }
    ) {
      // `user` and `account` are only passed on initial sign-in.
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
          token.backendToken = backendToken.accessToken;
          return token;

        } catch (error) {
          console.error("Error during backend token exchange:", error);
          token.error = "SignInError";
          return token;
        }
      }

      return token;
    },
    async session(
      { session, token }: {
        session: Session;
        token: JWT;
      }
    ) {
      // Pass the backend token and any errors to the client-side session.
      if (token.backendToken) {
        session.accessToken = token.backendToken as string;
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

