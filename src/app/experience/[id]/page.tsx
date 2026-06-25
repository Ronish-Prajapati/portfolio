import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, CheckCircle2, Briefcase } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getExperienceById, getExperiences, getProfile } from "@/lib/queries";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const experiences = await getExperiences();
  return experiences.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const experience = await getExperienceById(id);
  if (!experience) return { title: "Experience not found" };

  return {
    title: `${experience.position} at ${experience.company}`,
    description: experience.description,
    alternates: { canonical: `/experience/${experience.id}` },
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [experience, allExperiences, profile] = await Promise.all([
    getExperienceById(id),
    getExperiences(),
    getProfile(),
  ]);

  if (!experience) notFound();

  const otherExperiences = allExperiences.filter((e) => e.id !== experience.id).slice(0, 2);

  return (
    <main className="min-h-screen bg-background">
      <Header email={profile?.email} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-hero">
        <div className="container-custom">
          <Link
            href="/#experience"
            className="inline-flex items-center gap-2 text-hero-muted hover:text-hero-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Experience
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-hero-foreground">
                  {experience.position}
                </h1>
                <p className="text-xl text-accent">{experience.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-hero-muted">
              {experience.period && (
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {experience.period}
                </span>
              )}
              {experience.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {experience.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">Role Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {experience.description}
              </p>

              {experience.highlights.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    Key Achievements
                  </h3>
                  <ul className="space-y-4">
                    {experience.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-secondary rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-background text-foreground text-sm rounded-full border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="border-t border-border mt-6 pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Employment Details</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Position</dt>
                      <dd className="text-foreground font-medium">{experience.position}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Company</dt>
                      <dd className="text-foreground font-medium">{experience.company}</dd>
                    </div>
                    {experience.period && (
                      <div>
                        <dt className="text-muted-foreground">Duration</dt>
                        <dd className="text-foreground font-medium">{experience.period}</dd>
                      </div>
                    )}
                    {experience.location && (
                      <div>
                        <dt className="text-muted-foreground">Location</dt>
                        <dd className="text-foreground font-medium">{experience.location}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Experience */}
      {otherExperiences.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-foreground mb-8">Other Experience</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherExperiences.map((otherExp) => (
                <Link
                  key={otherExp.id}
                  href={`/experience/${otherExp.id}`}
                  className="group bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-all"
                >
                  <span className="text-xs text-muted-foreground font-mono">
                    {otherExp.period}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-1 mb-1 group-hover:text-accent transition-colors">
                    {otherExp.position}
                  </h3>
                  <p className="text-accent text-sm mb-2">{otherExp.company}</p>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {otherExp.description}
                  </p>
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
