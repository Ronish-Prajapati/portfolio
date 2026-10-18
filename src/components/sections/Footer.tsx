import Link from "next/link";
import type { Profile } from "@prisma/client";
import { ArrowRight, ArrowUp } from "lucide-react";
import { CTA } from "@/lib/sections";
import { siteConfig } from "@/lib/site";

interface FooterProps {
  profile: Profile | null;
}

/** Bottom bar shared by the homepage summit and the inner pages. */
export function FooterBar({ profile, topHref = "#top", topLabel = "Back to trailhead" }: FooterProps & { topHref?: string; topLabel?: string }) {
  const name = profile?.name ?? siteConfig.name;
  const links = [
    { href: "/blog", label: "Blog", external: false },
    { href: profile?.githubUrl ?? siteConfig.links.github, label: "GitHub", external: true },
    { href: profile?.linkedinUrl ?? siteConfig.links.linkedin, label: "LinkedIn", external: true },
  ];

  return (
    <div className="border-t border-snow/10">
      <div className="s-container flex flex-col gap-5 py-8 text-sm text-sage md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {links.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="s-link text-sage hover:text-snow">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={link.href} className="s-link text-sage hover:text-snow">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <a href={topHref} className="s-link text-fog hover:text-snow">
                {topLabel}
                <ArrowUp className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

/** Inner-page footer: a short invitation back to the summit, then the bar. */
const Footer = ({ profile }: FooterProps) => {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url(/landscape/topo.svg)] bg-[length:120%_auto] bg-[position:50%_30%] bg-no-repeat opacity-[0.07]"
      />
      <div className="s-container relative flex flex-col items-start gap-8 py-20 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="s-display text-[clamp(2.5rem,6vw,5rem)]">Let&rsquo;s build something together</p>
          <p className="mt-4 max-w-[52ch] text-sage">
            I&apos;m currently looking for new opportunities. Whether you have a project in mind or just want to chat, feel free to reach out!
          </p>
        </div>
        <Link href="/#contact" className="s-btn s-btn-primary shrink-0">
          {CTA.contact}
          <ArrowRight data-nudge="right" aria-hidden />
        </Link>
      </div>
      <FooterBar profile={profile} topHref="#" topLabel="Back to top" />
    </footer>
  );
};

export default Footer;
