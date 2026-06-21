import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-accent font-mono text-sm mb-3">404</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </main>
  );
}
