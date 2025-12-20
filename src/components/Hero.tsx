import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import heroImage from "@/assets/hero-developer.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-hero overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Mountain adventure backdrop"
          className="w-full h-full object-contain md:object-cover object-top md:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container-custom pt-32 md:pt-40 pb-20">
        <div className="max-w-4xl">
          <p className="text-hero-muted text-sm md:text-base font-mono mb-4 animate-fade-up opacity-0 stagger-1">
            Hello, I'm Ronish Prajapati
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-hero-foreground leading-tight mb-6 animate-fade-up opacity-0 stagger-2">
            Frontend developer
            <br />
            building with{" "}
            <span className="text-accent">React</span>
          </h1>

          <p className="text-hero-muted text-lg md:text-xl max-w-2xl mb-10 animate-fade-up opacity-0 stagger-3">
            I craft responsive, performant web applications using React, TypeScript, 
            and modern frontend technologies. Passionate about clean code and great user experiences.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up opacity-0 stagger-4">
            <Button variant="hero" size="lg" asChild>
              <a href="#projects">View Projects</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#about">About Me</a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 animate-fade-up opacity-0" style={{ animationDelay: "0.5s" }}>
            <a
              href="https://github.com/Ronish-Prajapati"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hero-muted hover:text-hero-foreground transition-colors"
            >
              <Github size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/ronish-prajapati-116abb26a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hero-muted hover:text-hero-foreground transition-colors"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:ronishprajapati0@gmail.com"
              className="text-hero-muted hover:text-hero-foreground transition-colors"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <a href="#about" className="text-hero-muted hover:text-hero-foreground transition-colors">
          <ArrowDown size={24} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
