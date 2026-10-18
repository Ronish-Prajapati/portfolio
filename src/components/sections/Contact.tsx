import type { CSSProperties } from "react";
import SummitVista from "@/components/landscape/SummitVista";
import type { Profile } from "@prisma/client";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/summit/ContactForm";
import CopyEmail from "@/components/summit/CopyEmail";
import { FooterBar } from "@/components/sections/Footer";
import { CTA } from "@/lib/sections";
import { siteConfig } from "@/lib/site";

interface ContactProps {
  profile: Profile | null;
}

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

/** The summit: the mountain after sunrise, an invitation, and every way to reach out. */
const Contact = ({ profile }: ContactProps) => {
  const email = profile?.email ?? siteConfig.links.email;
  const linkedin = profile?.linkedinUrl ?? siteConfig.links.linkedin;
  const github = profile?.githubUrl ?? siteConfig.links.github;
  const resume = profile?.resumeUrl ?? "/ronish-frontend.pdf";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative">
      <SummitVista>
        <div className="s-container pt-24 md:pt-28">
          <h2 id="contact-title" className="s-display max-w-[12ch] text-[clamp(2.75rem,6.4vw,5.75rem)]">
            <span data-reveal="mask" className="block overflow-hidden pb-[0.03em]">
              <span className="block">Let&rsquo;s build something together</span>
            </span>
          </h2>
        </div>
      </SummitVista>

      <div className="s-container relative grid gap-x-16 gap-y-14 pb-24 pt-4 md:pb-32 lg:-mt-24 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:pt-28">
          <p data-reveal className="max-w-[44ch] text-[clamp(1.15rem,1.6vw,1.35rem)] leading-relaxed text-fog">
            I&apos;m currently looking for new opportunities. Whether you have a project in mind or just want to chat, feel free to reach out!
          </p>

          <dl data-reveal style={delay(0.1)} className="mt-12 grid gap-x-10 gap-y-7 border-t border-snow/15 pt-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="s-label">Email</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-3">
                <a href={`mailto:${email}`} className="s-link break-all text-[clamp(1.15rem,2vw,1.5rem)] font-medium">
                  {email}
                </a>
                <CopyEmail email={email} />
              </dd>
            </div>
            <div>
              <dt className="s-label">Elsewhere</dt>
              <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="s-link">
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4" data-nudge="right" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a href={github} target="_blank" rel="noopener noreferrer" className="s-link">
                  GitHub
                  <ArrowUpRight className="h-4 w-4" data-nudge="right" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </dd>
            </div>
            <div>
              <dt className="s-label">{CTA.resume}</dt>
              <dd className="mt-2">
                <a href={resume} target="_blank" rel="noopener noreferrer" className="s-link">
                  <ArrowDownToLine className="h-4 w-4" aria-hidden />
                  Download PDF
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div
            data-reveal
            style={delay(0.1)}
            className="rounded-[2px] border border-snow/10 bg-forest-900/95 p-6 shadow-[0_40px_90px_-40px_rgb(var(--s-night))] md:p-10"
          >
            <h3 className="s-title mb-8 text-[1.75rem]">Send a message</h3>
            <ContactForm />
          </div>
        </div>
      </div>

      <FooterBar profile={profile} />
    </section>
  );
};

export default Contact;
