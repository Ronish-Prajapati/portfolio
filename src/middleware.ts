import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the edge-safe config (no Prisma) to gate /admin routes via the
// `authorized` callback. Unauthenticated requests are redirected to /admin/login.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  // The `authorized` callback in auth.config handles allow/deny + redirects.
  return undefined;
});

export const config = {
  matcher: ["/admin/:path*"],
};
