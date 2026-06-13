import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isRegister: { label: "Register", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const endpoint = credentials.isRegister === "true" ? "register" : "login";

        const body: Record<string, string> = {
          email: credentials.email,
          password: credentials.password,
        };
        if (credentials.isRegister === "true" && credentials.name) {
          body.name = credentials.name;
        }

        const res = await fetch(`${ML_API_URL}/api/v1/auth/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) return null;

        const tokens = await res.json();

        // Fetch user profile
        const meRes = await fetch(`${ML_API_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        if (!meRes.ok) return null;
        const user = await meRes.json();

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).userId = token.userId;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
};
