import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: "fullstack-intern-waveplus",
    title: "Full Stack Developer Intern (Laravel & React)",
    company: "Waveplus IT",
    location: "On-site",
    period: "April 2024 - June 2024",
    description:
      "Completed a 3-month internship as a Full Stack Developer, gaining hands-on experience in developing and maintaining web applications using Laravel and React.",
    highlights: [
      "Developed and maintained full-stack features using Laravel for backend APIs and React for frontend interfaces",
      "Worked on database-driven applications and RESTful API integration",
      "Assisted in implementing authentication, role-based access control, and CRUD functionalities",
      "Gained real-world experience working in an agile team environment on production-level projects",
    ],
    technologies: [
      "Laravel",
      "React",
      "JavaScript",
      "PHP",
      "MySQL",
      "REST APIs",
      "Git",
    ],
  },
  {
    id: "frontend-developer-waveplus",
    title: "Frontend Developer (React / TypeScript)",
    company: "Waveplus IT",
    location: "On-site",
    period: "July 2024 - Present",
    description:
      "Working as a Frontend Developer building responsive and interactive user interfaces using React and TypeScript, with seamless integration to Laravel backends through Inertia.js.",
    highlights: [
      "Built responsive and interactive UIs using React (JS/TS) and Inertia.js integrated with Laravel backends",
      "Contributed to real-world projects including project tracking systems, e-commerce platforms, coworking space management, and student management applications",
      "Implemented efficient state and data management using Zustand, Redux Toolkit, and TanStack Query with mutations",
      "Collaborated closely with backend developers and designers to ensure clean UI/UX, API integration, and cross-browser compatibility",
    ],
    technologies: [
      "React",
      "TypeScript",
      "JavaScript",
      "Inertia.js",
      "Zustand",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "Laravel",
      "Git",
    ],
  },
  
];


const Experience = () => {
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
            A snapshot of my frontend development journey, from internships to building production-ready applications with tech teams.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experienceData.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 pb-12 last:pb-0">
              {/* Timeline Line */}
              {index !== experienceData.length - 1 && (
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
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.title}
                    </h3>
                    <p className="text-accent font-medium">{exp.company}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {exp.location}
                    </span>
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
                  to={`/experience/${exp.id}`}
                  className="inline-flex items-center gap-1 text-sm text-accent hover:gap-2 transition-all"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a href="/ronish-frontend.pdf" target="_blank" rel="noopener noreferrer">
              Download Resume
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Experience;
