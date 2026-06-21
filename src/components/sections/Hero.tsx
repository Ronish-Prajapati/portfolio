import Image from "next/image";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import type { Profile } from "@prisma/client";

interface HeroProps {
  profile: Profile | null;
}

const Hero = ({ profile }: HeroProps) => {
  const greeting = profile?.heroGreeting ?? "Hello, I'm Ronish Prajapati";
  const headline = profile?.heroHeadline ?? "Frontend developer building with";
  const highlight = profile?.heroHighlight ?? "React";
  const subtitle =
    profile?.heroSubtitle ??
    "I craft responsive, performant web applications using React, TypeScript, and modern frontend technologies. Passionate about clean code and great user experiences.";
  const heroImage = profile?.heroImage ?? "/images/hero-developer.png";
  const github = profile?.githubUrl ?? "https://github.com/Ronish-Prajapati";
  const linkedin =
    profile?.linkedinUrl ?? "https://www.linkedin.com/in/ronish-prajapati-116abb26a/";
  const email = profile?.email ?? "ronishprajapati0@gmail.com";

  return (
    <section className="relative min-h-[100dvh] bg-blue-900 overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Mountain adventure backdrop"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-4xl">
          <p className="text-blue-200 text-sm md:text-base font-mono mb-4 animate-fade-in">
            {greeting}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            {headline}
            <br />
            building with{" "}
            <span className="text-yellow-400">{highlight}</span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-10">{subtitle}</p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#projects"
              className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Projects
            </a>
            <a
              href="#about"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              About Me
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href={`mailto:${email}`}
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-blue-200 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll to about section"
      >
        <ArrowDown size={24} />
      </a>
    </section>
  );
};

export default Hero;
