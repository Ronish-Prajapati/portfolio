import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Admin pages are always dynamic (session-dependent, never cached).
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  // Unauthenticated (e.g. the /admin/login page) renders without the shell.
  // The middleware redirects all other /admin routes to login.
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userName={session.user.name} />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
