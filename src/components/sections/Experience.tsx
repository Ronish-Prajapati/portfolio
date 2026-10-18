import type { Education, Experience as ExperienceModel } from "@prisma/client";
import ClimbRoute, { type ClimbEntry } from "@/components/summit/ClimbRoute";
import { SectionHeading } from "@/components/summit/SectionHeading";
import { stripHtml } from "@/lib/format";

interface ExperienceProps {
  experiences: ExperienceModel[];
  education: Education[];
  resumeUrl?: string | null;
}

const firstYear = (text?: string | null) => {
  const match = text?.match(/\d{4}/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
};

/**
 * "The climb": education is base camp, each role a camp above it, in the
 * order they happened. Facts (dates, roles, employers, responsibilities,
 * technologies) come straight from the CMS.
 */
const Experience = ({ experiences, education, resumeUrl }: ExperienceProps) => {
  const stops = [
    ...education.map((edu, i) => ({
      year: firstYear(edu.startYear),
      tiebreak: i,
      entry: {
        key: `edu-${edu.id}`,
        kind: "education" as const,
        period: edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear,
        title: edu.degree,
        org: edu.institution,
        location: null,
        description: edu.description ? stripHtml(edu.description) : null,
        highlights: [],
        technologies: [],
      },
    })),
    ...experiences.map((exp, i) => ({
      year: firstYear(exp.period) === Number.POSITIVE_INFINITY && exp.startDate ? exp.startDate.getFullYear() : firstYear(exp.period),
      tiebreak: 100 + i,
      entry: {
        key: `exp-${exp.id}`,
        kind: "role" as const,
        period: exp.period,
        title: exp.position,
        org: exp.company,
        location: exp.location,
        description: stripHtml(exp.description),
        highlights: exp.highlights,
        technologies: exp.technologies,
        href: `/experience/${exp.id}`,
        current: exp.current,
      },
    })),
  ].sort((a, b) => a.year - b.year || a.tiebreak - b.tiebreak);

  let camp = 0;
  let educationAnchored = false;
  const entries: ClimbEntry[] = stops.map(({ entry }, i) => {
    const isBase = i === 0;
    if (!isBase) camp += 1;
    const anchor = entry.kind === "education" && !educationAnchored ? "education" : undefined;
    if (anchor) educationAnchored = true;
    return { ...entry, anchor, marker: isBase ? "Base camp" : `Camp ${camp}` };
  });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/70 to-forest-950" />
      <div className="s-container relative">
        <SectionHeading id="experience-title" title="The climb" className="mb-16 md:mb-24">
          Experience and education, from base camp to the role I hold now.
        </SectionHeading>
        {entries.length > 0 ? (
          <ClimbRoute entries={entries} resumeUrl={resumeUrl ?? "/ronish-frontend.pdf"} />
        ) : (
          <p className="max-w-md border-t border-snow/10 pt-6 text-sage">The route is being charted. Check back soon.</p>
        )}
      </div>
    </section>
  );
};

export default Experience;
