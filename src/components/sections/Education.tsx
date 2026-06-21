import { GraduationCap } from "lucide-react";
import type { Education as EducationModel } from "@prisma/client";

interface EducationProps {
  education: EducationModel[];
}

const Education = ({ education }: EducationProps) => {
  if (education.length === 0) return null;

  return (
    <section id="education" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">Background</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Education</h2>
          <p className="text-muted-foreground">
            The academic foundation behind my development journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {education.map((edu, index) => (
            <div key={edu.id} className="relative pl-8 pb-12 last:pb-0">
              {index !== education.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
              )}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent-foreground" />
              </div>

              <div className="bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-accent font-medium">{edu.institution}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">
                    {edu.startYear}
                    {edu.endYear ? ` - ${edu.endYear}` : ""}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-muted-foreground mt-3">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
