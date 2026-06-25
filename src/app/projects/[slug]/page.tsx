import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
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

  const otherProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <main className="min-h-screen bg-background">
      <Header email={profile?.email} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-custom">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-sm text-accent font-mono mb-4">
                <Calendar size={14} />
                {project.year}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-background text-foreground text-sm rounded-full border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.liveLink && (
                  <Button size="lg" asChild>
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.githubLink && (
                  <Button variant="outline" size="lg" asChild>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github size={18} />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {project.image && (
              <div className="relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={450}
                  className="w-full rounded-2xl shadow-floating"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {project.longDescription}
              </p>

              {project.features.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-secondary rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Tech Stack</h3>
                <div className="space-y-3">
                  {project.technologies.map((tech) => (
                    <div key={tech} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      {tech}
                    </div>
                  ))}
                </div>

                {(project.liveLink || project.githubLink) && (
                  <div className="border-t border-border mt-6 pt-6">
                    <h3 className="font-semibold text-foreground mb-4">Links</h3>
                    <div className="space-y-3">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-accent hover:underline"
                        >
                          <ExternalLink size={16} />
                          View Live Site
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-accent hover:underline"
                        >
                          <Github size={16} />
                          GitHub Repository
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-foreground mb-8">Other Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((otherProject) => (
                <Link
                  key={otherProject.id}
                  href={`/projects/${otherProject.slug}`}
                  className="group bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-all"
                >
                  <span className="text-xs text-muted-foreground font-mono">
                    {otherProject.year}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-accent transition-colors">
                    {otherProject.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{otherProject.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer profile={profile} />
    </main>
  );
}
