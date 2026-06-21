import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Experience as ExperienceModel, Profile } from "@prisma/client";

interface ExperienceProps {
  experiences: ExperienceModel[];
  resumeUrl?: string | null;
}

const Experience = ({ experiences, resumeUrl }: ExperienceProps) => {
  return (
    <section id="experience" className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">My Journey</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Work Experience
          </h2>
          <p className="text-muted-foreground">
            A snapshot of my frontend development journey, from internships to building
            production-ready applications with tech teams.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 pb-12 last:pb-0">
              {/* Timeline Line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
              )}

              {/* Timeline Dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent-foreground" />
              </div>

              {/* Content Card */}
              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{exp.position}</h3>
                    <p className="text-accent font-medium">{exp.company}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {exp.period && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.period}
                      </span>
                    )}
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{exp.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/experience/${exp.id}`}
                  className="inline-flex items-center gap-1 text-sm text-accent hover:gap-2 transition-all"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {resumeUrl && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Download Resume
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
