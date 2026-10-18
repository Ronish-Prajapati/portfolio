import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="summit s-grain relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url(/landscape/topo.svg)] bg-[length:150%_auto] bg-center bg-no-repeat opacity-[0.1]"
      />
      <div className="s-container relative">
        <p className="s-label text-ember">404</p>
        <h1 className="s-display mt-4 text-[clamp(3.5rem,11vw,9rem)]">Page not found</h1>
        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-sage">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="s-btn s-btn-primary mt-10">
          <ArrowLeft aria-hidden />
          Back to the trailhead
        </Link>
      </div>
    </main>
  );
}
