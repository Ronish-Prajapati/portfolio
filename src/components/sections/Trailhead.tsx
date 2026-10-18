import type { CSSProperties } from "react";
import type { Experience, Profile } from "@prisma/client";
import { ArrowDown, ArrowDownToLine, ArrowRight } from "lucide-react";
import { CTA } from "@/lib/sections";
import { siteConfig } from "@/lib/site";

interface TrailheadProps {
  profile: Profile | null;
  experiences: Experience[];
}

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

/** Split "First sentence. The rest." so the lead sentence can carry more weight. */
function splitLead(text: string) {
  const match = text.match(/^(.+?[.!?])\s+(.+)$/s);
  return match ? [match[1], match[2]] : [text, ""];
}

const Trailhead = ({ profile, experiences }: TrailheadProps) => {
  const statement =
    profile?.heroSubtitle?.trim() ||
    profile?.shortDescription?.trim() ||
    "I craft responsive, performant web applications using React, TypeScript, and modern frontend technologies.";
  const [lead, rest] = splitLead(statement);
  const current = experiences.find((e) => e.current) ?? experiences[experiences.length - 1];
  const focus = (profile?.techStack ?? []).slice(0, 3);
  const resume = profile?.resumeUrl ?? "/ronish-frontend.pdf";

  const facts = [
    current ? { label: "Currently", value: current.position, detail: current.company } : null,
    focus.length ? { label: "Focus", value: focus.join(", "), detail: null } : null,
    { label: "From", value: siteConfig.location, detail: null },
  ].filter((f): f is { label: string; value: string; detail: string | null } => Boolean(f));

  return (
    <section id="trailhead" aria-labelledby="trailhead-title" className="relative pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="s-container grid gap-x-12 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 id="trailhead-title" className="sr-only">
            Introduction
          </h2>
          <p
            data-reveal
            className="text-balance text-[clamp(1.65rem,3.4vw,3.1rem)] font-medium leading-[1.16] tracking-[-0.015em] text-snow"
          >
            {lead} {rest ? <span className="text-sage">{rest}</span> : null}
          </p>

          <div data-reveal style={delay(0.12)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a href="#projects" className="s-btn s-btn-primary">
              {CTA.work}
              <ArrowDown data-nudge="down" aria-hidden />
            </a>
            <a href={resume} target="_blank" rel="noopener noreferrer" className="s-link text-[0.95rem]">
              <ArrowDownToLine className="h-4 w-4" aria-hidden />
              {CTA.resume} (PDF)
            </a>
            <a href="#contact" className="s-link text-[0.95rem]">
              {CTA.contact}
              <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
            </a>
          </div>
        </div>

        <dl className="grid content-end gap-0 self-end sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
          {facts.map((fact, i) => (
            <div key={fact.label} data-reveal style={delay(0.08 * i + 0.1)} className="border-t border-snow/10 py-5 sm:pr-6 lg:pr-0">
              <dt className="s-label">{fact.label}</dt>
              <dd className="mt-2 text-[1.05rem] leading-snug text-snow">
                {fact.value}
                {fact.detail ? <span className="block text-sage">{fact.detail}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Trailhead;
