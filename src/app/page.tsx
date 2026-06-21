import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import {
  getProfile,
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getTestimonials,
} from "@/lib/queries";

// Revalidate the home page hourly; admin edits also revalidate on demand.
export const revalidate = 3600;

export default async function HomePage() {
  const [profile, skills, experiences, projects, education, testimonials] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperiences(),
    getProjects(),
    getEducation(),
    getTestimonials(),
  ]);

  return (
    <main className="min-h-screen">
      <Header email={profile?.email} />
      <Hero profile={profile} />
      <About profile={profile} skills={skills} />
      <Experience experiences={experiences} resumeUrl={profile?.resumeUrl} />
      <Projects projects={projects} />
      <Education education={education} />
      <Testimonials testimonials={testimonials} />
      <Contact email={profile?.email} />
      <Footer profile={profile} />
    </main>
  );
}
