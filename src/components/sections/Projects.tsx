import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import ParallaxFrame from "@/components/summit/ParallaxFrame";
import { SectionHeading } from "@/components/summit/SectionHeading";

interface ProjectsProps {
  projects: Project[];
}

type Variant = "feature" | "left" | "right" | "wide";

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

// Rotate compositions so no two neighbouring expeditions share a layout.
const variantFor = (index: number): Variant =>
  index === 0 ? "feature" : (["wide", "left", "right"] as const)[index % 3];

const MAX_CHIPS = 6;

/** Keep hyphenated words ("E-commerce") together when a title wraps. */
const keepCompounds = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) =>
    /\S-\S/.test(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );

/** "2024 to now" style range from the project years (e.g. "2024", "2025-2026"). */
function yearRange(projects: Project[]) {
  const years = projects
    .flatMap((p) => (p.year ?? "").match(/\d{4}/g) ?? [])
    .map(Number)
    .sort((a, b) => a - b);
  if (years.length === 0) return null;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? `${first}` : `${first} to ${last}`;
}

const Projects = ({ projects }: ProjectsProps) => {
  const range = yearRange(projects);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-28 md:py-40">
      <div className="s-container">
        <SectionHeading id="projects-title" title="Expeditions">
          Selected projects{range ? `, ${range}` : ""}. Production work from government platforms to e-commerce,
          each with the full story in its case study.
        </SectionHeading>

        {projects.length === 0 ? (
          <p className="mt-16 max-w-md border-t border-snow/10 pt-6 text-sage">
            New expeditions are being prepared. Check back soon.
          </p>
        ) : (
          <ol className="mt-20 space-y-32 md:mt-28 md:space-y-48">
            {projects.map((project, index) => (
              <li key={project.id}>
                <ProjectEntry project={project} variant={variantFor(index)} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

function ProjectEntry({ project, variant }: { project: Project; variant: Variant }) {
  const caseStudy = `/projects/${project.slug}`;
  const sizes =
    variant === "feature" || variant === "wide"
      ? "(max-width: 1024px) 100vw, 1300px"
      : "(max-width: 1024px) 100vw, 760px";

  const frame = (aspect: string) => (
    <Link href={caseStudy} tabIndex={-1} className="group block" aria-label={`${project.title} case study`}>
      <div data-reveal="clip" className="relative">
        <ParallaxFrame
          className={`${aspect} rounded-[2px] border border-snow/10 bg-forest-900 shadow-[0_40px_80px_-40px_rgb(var(--s-night)/0.9)]`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes={sizes}
              className="object-cover object-top transition-transform [transition-duration:1.2s] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-0 bg-[url(/landscape/topo.svg)] bg-cover bg-center opacity-30" />
          )}
        </ParallaxFrame>
      </div>
    </Link>
  );

  if (variant === "feature") {
    return (
      <article className="relative">
        {frame("aspect-[16/10] md:aspect-[2/1]")}
        <div className="relative bg-forest-950 pt-8 lg:-mt-36 lg:w-[min(48rem,60%)] lg:pr-12 lg:pt-10">
          <ProjectText project={project} caseStudy={caseStudy} size="lg" />
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className="lg:px-[8.333%]">
        {frame("aspect-[16/10] md:aspect-[21/9]")}
        <div className="mt-8 grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <ProjectText project={project} caseStudy={caseStudy} size="md" layout="columns" />
        </div>
      </article>
    );
  }

  const imageFirst = variant === "left";
  return (
    <article className="grid items-center gap-x-14 gap-y-8 lg:grid-cols-12">
      <div className={imageFirst ? "lg:col-span-7" : "lg:order-2 lg:col-span-7 lg:-mt-20"}>{frame("aspect-[16/10]")}</div>
      <div className={imageFirst ? "lg:col-span-5 lg:pt-24" : "lg:order-1 lg:col-span-5 lg:pb-16"}>
        <ProjectText project={project} caseStudy={caseStudy} size="md" />
      </div>
    </article>
  );
}

function ProjectText({
  project,
  caseStudy,
  size,
  layout = "stack",
}: {
  project: Project;
  caseStudy: string;
  size: "lg" | "md";
  layout?: "stack" | "columns";
}) {
  const extra = project.technologies.length - MAX_CHIPS;
  const titleSize = size === "lg" ? "text-[clamp(1.9rem,3.4vw,3rem)]" : "text-[clamp(1.75rem,2.6vw,2.4rem)]";

  const heading = (
    <div data-reveal>
      {project.year ? <p className="s-label">{project.year}</p> : null}
      <h3 className={`s-title mt-3 ${titleSize}`}>
        <Link href={caseStudy} className="transition-colors hover:text-ember">
          {keepCompounds(project.title)}
        </Link>
      </h3>
    </div>
  );

  const body = (
    <div data-reveal style={delay(0.08)}>
      <p className="s-prose">{project.description}</p>
      {project.role ? (
        <p className="mt-5 max-w-[60ch] border-l border-ember/60 pl-4 text-[0.95rem] leading-relaxed text-fog">
          <span className="s-label mb-1 block text-ember">My role</span>
          {project.role}
        </p>
      ) : null}
    </div>
  );

  const meta = (
    <div data-reveal style={delay(0.16)}>
      {project.technologies.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.technologies.slice(0, MAX_CHIPS).map((tech) => (
            <li key={tech} className="s-chip">
              {tech}
            </li>
          ))}
          {extra > 0 ? <li className="s-chip text-sage">+{extra} more</li> : null}
        </ul>
      ) : null}
      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.95rem]">
        <Link href={caseStudy} className="s-link font-medium">
          Case study
          <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
        </Link>
        {project.liveLink ? (
          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="s-link text-fog">
            Live site
            <ArrowUpRight className="h-4 w-4" data-nudge="right" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
        {project.githubLink ? (
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="s-link text-fog">
            <Github className="h-4 w-4" aria-hidden />
            Source
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </div>
  );

  if (layout === "columns") {
    return (
      <>
        <div className="lg:col-span-5">{heading}</div>
        <div className="lg:col-span-4">{body}</div>
        <div className="lg:col-span-3">{meta}</div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {heading}
      {body}
      {meta}
    </div>
  );
}

export default Projects;
