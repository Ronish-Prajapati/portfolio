import type { NextAuthConfig } from "next-auth";

// Edge-safe NextAuth config (no Prisma / bcrypt imports). Shared by the
// middleware and the full auth instance. The Credentials provider — which
// needs Node APIs — is added in `auth.ts`, not here.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    // Used by the middleware to gate /admin routes.
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;

      // The login page is always reachable.
      if (pathname === "/admin/login") return true;

      // Everything else under /admin requires a session.
      if (pathname.startsWith("/admin")) return isLoggedIn;

      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
