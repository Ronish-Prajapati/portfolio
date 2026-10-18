import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryImage, Profile } from "@prisma/client";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ParallaxFrame from "@/components/summit/ParallaxFrame";
import { SectionHeading } from "@/components/summit/SectionHeading";
import Gallery from "@/components/sections/Gallery";

interface AboutProps {
  profile: Profile | null;
  gallery: GalleryImage[];
}

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const About = ({ profile, gallery }: AboutProps) => {
  const lead =
    profile?.about?.trim() ||
    "I'm a passionate junior frontend developer with a strong foundation in React and TypeScript. I love turning designs into pixel-perfect, interactive experiences.";
  const paragraphs = profile?.aboutParagraphs ?? [];
  const photo = profile?.heroImage || "/images/hero-developer.png";
  const github = profile?.githubUrl;

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-40">
      <div className="s-container grid items-start gap-x-16 gap-y-14 lg:grid-cols-12">
        <figure className="lg:sticky lg:top-24 lg:col-span-5">
          <div data-reveal="clip">
            <ParallaxFrame amount={4} className="aspect-[4/5] rounded-[2px] border border-snow/10 bg-forest-900">
              <Image
                src={photo}
                alt="Ronish Prajapati standing on a snowfield with a trekking pole, snow-covered peaks behind him"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[68%_45%]"
              />
            </ParallaxFrame>
          </div>
        </figure>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
          <SectionHeading id="about-title" title="Beyond the screen" />
          <p data-reveal className="mt-10 text-balance text-[clamp(1.35rem,2.1vw,1.8rem)] font-medium leading-[1.3] text-snow">
            {lead}
          </p>
          {paragraphs.map((paragraph, i) => (
            <p key={i} data-reveal style={delay(0.06 * (i + 1))} className="s-prose mt-6">
              {paragraph}
            </p>
          ))}
          <div data-reveal style={delay(0.2)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.95rem]">
            <Link href="/blog" className="s-link font-medium">
              Read the blog
              <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
            </Link>
            {github ? (
              <a href={github} target="_blank" rel="noopener noreferrer" className="s-link text-fog">
                GitHub
                <ArrowUpRight className="h-4 w-4" data-nudge="right" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {gallery.length > 0 ? <Gallery images={gallery} /> : null}
    </section>
  );
};

export default About;
