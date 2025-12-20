import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import projectPTS from "@/assets/pts.png";
import projectCurlyBelle from "@/assets/curly.png";
import projectHippyDesk from "@/assets/hippy.png";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  year: string;
}

export const projectsData: Project[] = [
  {
    id: "project-tracking-reporting-system",
    title: "Project Tracking & Reporting System",
    description:
      "A fully responsive system for tracking project progress, tender requests, and reporting for local governing bodies.",
    longDescription:
      "A production-level project tracking and reporting system built using React and Inertia.js, integrated with a Laravel backend. The system enables local-level governing bodies to monitor project status, tender requests, and progress reports. I worked primarily on the frontend, developing responsive dashboard and home page interfaces with a strong focus on usability and data visualization.",
    image: projectPTS,
    technologies: ["React", "Inertia.js", "JavaScript", "Laravel", "Tailwind CSS"],
    features: [
      "Responsive dashboard for project progress tracking",
      "Tender request and reporting interfaces",
      "Real-time project status visualization",
      "Optimized UI for local government workflows",
      "Cross-browser compatible and mobile-friendly design",
    ],
    liveUrl: "https://pts.waveplus.com.np",
    githubUrl: "",
    year: "2024",
  },
  {
    id: "curly-belle-ecommerce",
    title: "Curly Belle E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with product management, secure checkout, and admin reporting.",
    longDescription:
      "An e-commerce platform built using React and Laravel. The public-facing home pages were implemented using Laravel Blade components for improved SEO, while the admin dashboard was developed in React for a dynamic and interactive experience. The system includes product listings, cart and checkout flow, and complex admin features such as challani, lot management, stock adjustment, warehousing, and ledger reporting.",
    image: projectCurlyBelle,
    technologies: [
      "React",
      "Laravel",
      "Blade",
      "JavaScript",
      "Tailwind CSS",
      "MySQL",
    ],
    features: [
      "Product listings with cart and secure checkout",
      "SEO-optimized home pages using Blade components",
      "React-based admin dashboard for monitoring and reports",
      "Challani, lot management, and stock adjustment modules",
      "Warehousing and ledger tracking system",
    ],
    liveUrl: "https://apicamera.waveplus.com.np",
    githubUrl: "",
    year: "2025",
  },
  {
    id: "hippy-desk-coworking-platform",
    title: "Hippy Desk – Coworking Platform",
    description:
      "A coworking space listing and management platform for browsing, booking, and managing workspaces.",
    longDescription:
      "A modern coworking platform built with React and TypeScript that allows users to browse, book, and manage coworking spaces. The application focuses on clean UI, responsive design, and smooth user interactions. I contributed to building frontend features and interfaces that ensure an intuitive booking and management experience.",
    image: projectHippyDesk,
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    features: [
      "Workspace listing and detailed space pages",
      "Booking and availability management",
      "Responsive and user-friendly UI",
      "Optimized performance for real-world users",
      "Clean component-based architecture",
    ],
    liveUrl: "https://www.hippydesk.com",
    githubUrl: "",
    year: "2024",
  },
];


const Projects = () => {
  return (
    <section id="projects" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">My Work</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Projects that show what I do
          </h2>
          <p className="text-muted-foreground">
            A collection of projects I've built to demonstrate my skills in React, 
            TypeScript, and modern frontend development.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevated transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-hero/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-hero-foreground rounded-full text-hero hover:scale-110 transition-transform"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-hero-foreground rounded-full text-hero hover:scale-110 transition-transform"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <span className="text-xs text-muted-foreground font-mono">
                  {project.year}
                </span>
                <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center gap-1 text-sm text-accent hover:gap-2 transition-all"
                >
                  View Case Study <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
