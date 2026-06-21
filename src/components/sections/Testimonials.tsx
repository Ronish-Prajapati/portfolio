import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">Kind Words</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Testimonials</h2>
          <p className="text-muted-foreground">
            What people I&apos;ve worked with have to say.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-all duration-300 flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/40 mb-4" />
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                &ldquo;{t.message}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.image ? (
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
