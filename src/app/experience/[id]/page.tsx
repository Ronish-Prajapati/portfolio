import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getExperienceById, getExperiences, getProfile } from "@/lib/queries";
import { stripHtml } from "@/lib/format";

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
  const details = [
    { label: "Position", value: experience.position },
    { label: "Company", value: experience.company },
    { label: "Duration", value: experience.period },
    { label: "Location", value: experience.location },
  ].filter((d): d is { label: string; value: string } => Boolean(d.value));

  return (
    <main className="summit s-grain min-h-screen">
      <Header email={profile?.email} resumeUrl={profile?.resumeUrl} />

      <article>
        <header className="s-container pb-16 pt-32 md:pt-40">
          <Link href="/#experience" className="s-link text-sm text-sage hover:text-snow">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to the climb
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1">
            {experience.period ? <span className="s-label text-fog">{experience.period}</span> : null}
            {experience.location ? <span className="s-label">{experience.location}</span> : null}
            {experience.current ? (
              <span className="rounded-[2px] border border-ember/50 px-1.5 py-0.5 font-label text-[0.65rem] uppercase tracking-[0.14em] text-ember">
                Current
              </span>
            ) : null}
          </div>
          <h1 className="s-title mt-5 max-w-[22ch] text-[clamp(2.4rem,5.2vw,4.75rem)]">{experience.position}</h1>
          <p className="mt-3 text-xl text-fog">{experience.company}</p>
        </header>

        <div className="s-container grid gap-16 border-t border-snow/10 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="s-title text-[clamp(1.75rem,2.6vw,2.25rem)]">Role overview</h2>
            <p className="s-prose mt-6">{stripHtml(experience.description)}</p>

            {experience.highlights.length > 0 ? (
              <>
                <h2 className="s-title mt-16 text-[clamp(1.75rem,2.6vw,2.25rem)]">Key achievements</h2>
                <ul className="mt-6 grid">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index} className="flex gap-4 border-t border-snow/10 py-4 leading-relaxed text-fog">
                      <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-ember" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              {experience.technologies.length > 0 ? (
                <div className="border-t border-snow/10 py-5">
                  <h2 className="s-label">Technologies used</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <li key={tech} className="s-chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="border-t border-snow/10 py-5">
                <h2 className="s-label">Employment details</h2>
                <dl>
                  {details.map((d) => (
                    <div key={d.label} className="mt-4">
                      <dt className="text-sm text-sage">{d.label}</dt>
                      <dd className="text-snow">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {otherExperiences.length > 0 ? (
        <section aria-labelledby="other-title" className="s-container">
          <h2 id="other-title" className="s-label border-t border-snow/10 pt-10">
            Other roles
          </h2>
          <ul className="mt-6 grid gap-x-12 md:grid-cols-2">
            {otherExperiences.map((other) => (
              <li key={other.id}>
                <Link href={`/experience/${other.id}`} className="group block border-t border-snow/10 py-6">
                  {other.period ? <span className="s-label">{other.period}</span> : null}
                  <span className="s-title mt-2 block text-2xl transition-colors group-hover:text-ember">{other.position}</span>
                  <span className="mt-1 block text-fog">{other.company}</span>
                  <span className="s-link mt-4 text-sm">
                    Role details
                    <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Footer profile={profile} />
    </main>
  );
}
