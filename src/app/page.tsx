import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Trailhead from "@/components/sections/Trailhead";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import TechTerrain from "@/components/sections/TechTerrain";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import RevealObserver from "@/components/summit/RevealObserver";
import WaypointRail from "@/components/summit/WaypointRail";
import { SECTIONS } from "@/lib/sections";
import {
  getProfile,
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getGallery,
  getTestimonials,
} from "@/lib/queries";

// Revalidate the home page hourly; admin edits also revalidate on demand.
export const revalidate = 3600;

export default async function HomePage() {
  const [profile, skills, experiences, projects, education, gallery, testimonials] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getExperiences(),
      getProjects(),
      getEducation(),
      getGallery(),
      getTestimonials(),
    ]);

  const waypoints = SECTIONS.filter((s) => s.id !== "testimonials" || testimonials.length > 0);

  return (
    <main className="summit s-grain min-h-screen">
      <a
        href="#trailhead"
        className="sr-only z-[70] rounded-[2px] bg-ember px-4 py-2 font-medium text-forest-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header email={profile?.email} resumeUrl={profile?.resumeUrl} variant="home" />
      <Hero profile={profile} />
      <Trailhead profile={profile} experiences={experiences} />
      <Projects projects={projects} />
      <Experience experiences={experiences} education={education} resumeUrl={profile?.resumeUrl} />
      <About profile={profile} gallery={gallery} />
      <TechTerrain profile={profile} skills={skills} projects={projects} experiences={experiences} />
      <Testimonials testimonials={testimonials} />
      <Contact profile={profile} />
      <WaypointRail sections={waypoints} />
      <RevealObserver />
    </main>
  );
}
