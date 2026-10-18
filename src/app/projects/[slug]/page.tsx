import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import RevealObserver from "@/components/summit/RevealObserver";
import { getProjectBySlug, getProjects, getProfile } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `${siteConfig.url}/projects/${project.slug}`,
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects, profile] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getProfile(),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((p) => p.id === project.id);
  const next = allProjects.length > 1 ? allProjects[(index + 1) % allProjects.length] : null;

  return (
    <main className="summit s-grain min-h-screen">
      <Header email={profile?.email} resumeUrl={profile?.resumeUrl} />

      <article>
        <header className="s-container pb-14 pt-32 md:pt-40">
          <Link href="/#projects" className="s-link text-sm text-sage hover:text-snow">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All expeditions
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              {project.year ? <p className="s-label">{project.year}</p> : null}
              <h1 className="s-title mt-4 text-[clamp(2.4rem,5.2vw,4.75rem)]">{project.title}</h1>
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-fog">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              {project.liveLink ? (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-primary">
                  Visit live site
                  <ArrowUpRight data-nudge="right" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
              {project.githubLink ? (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-ghost">
                  <Github aria-hidden />
                  Source code
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </div>
        </header>

        {project.image ? (
          <div className="s-container">
            <div data-reveal="clip">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] border border-snow/10 bg-forest-900 md:aspect-[2/1]">
                <Image
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  fill
                  priority
                  sizes="(max-width: 1440px) 100vw, 1408px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="s-container grid gap-16 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="s-title text-[clamp(1.75rem,2.6vw,2.25rem)]">About this project</h2>
            <div className="mt-6 space-y-5">
              {paragraphs(project.longDescription).map((p, i) => (
                <p key={i} className="s-prose">
                  {p}
                </p>
              ))}
            </div>

            {project.features.length > 0 ? (
              <>
                <h2 className="s-title mt-16 text-[clamp(1.75rem,2.6vw,2.25rem)]">Key features</h2>
                <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex gap-4 border-t border-snow/10 py-4 text-fog">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-ember" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <dl className="grid gap-0 lg:sticky lg:top-28">
              {project.year ? (
                <div className="border-t border-snow/10 py-5">
                  <dt className="s-label">Year</dt>
                  <dd className="mt-2 text-snow">{project.year}</dd>
                </div>
              ) : null}
              {project.role ? (
                <div className="border-t border-snow/10 py-5">
                  <dt className="s-label">My role</dt>
                  <dd className="mt-2 leading-relaxed text-snow">{project.role}</dd>
                </div>
              ) : null}
              {project.technologies.length > 0 ? (
                <div className="border-t border-snow/10 py-5">
                  <dt className="s-label">Stack</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="s-chip">
                        {tech}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
              {project.liveLink || project.githubLink ? (
                <div className="border-t border-snow/10 py-5">
                  <dt className="s-label">Links</dt>
                  <dd className="mt-3 grid gap-2">
                    {project.liveLink ? (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="s-link w-fit break-all">
                        {project.liveLink.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        <ArrowUpRight className="h-4 w-4 shrink-0" data-nudge="right" aria-hidden />
                      </a>
                    ) : null}
                    {project.githubLink ? (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="s-link w-fit">
                        GitHub repository
                        <ArrowUpRight className="h-4 w-4" data-nudge="right" aria-hidden />
                      </a>
                    ) : null}
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </article>

      {next ? (
        <section aria-labelledby="next-title" className="s-container">
          <Link href={`/projects/${next.slug}`} className="group grid items-center gap-8 border-t border-snow/10 pt-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="s-label">Next expedition</p>
              <h2 id="next-title" className="s-title mt-4 text-[clamp(1.75rem,3vw,2.75rem)] transition-colors group-hover:text-ember">
                {next.title}
              </h2>
              <span className="s-link mt-6 text-[0.95rem]">
                Read the case study
                <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
              </span>
            </div>
            {next.image ? (
              <div className="relative aspect-[2/1] overflow-hidden rounded-[2px] border border-snow/10 md:col-span-7">
                <Image
                  src={next.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                />
              </div>
            ) : null}
          </Link>
        </section>
      ) : null}

      <Footer profile={profile} />
      <RevealObserver />
    </main>
  );
}
