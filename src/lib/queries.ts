import "server-only";
import { prisma } from "@/lib/prisma";

// Cache tags used to revalidate sections after admin edits.
export const TAGS = {
  profile: "profile",
  projects: "projects",
  skills: "skills",
  experience: "experience",
  education: "education",
  blogs: "blogs",
  testimonials: "testimonials",
} as const;

/**
 * Wrap a DB read so a missing/unreachable database (e.g. during a build with no
 * credentials) degrades gracefully to a fallback instead of crashing the page.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[queries] database read failed:", error);
    return fallback;
  }
}

export function getProfile() {
  return safe(() => prisma.profile.findFirst(), null);
}

export function getProjects() {
  return safe(
    () => prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    [],
  );
}

export function getProjectBySlug(slug: string) {
  return safe(() => prisma.project.findUnique({ where: { slug } }), null);
}

export function getSkills() {
  return safe(() => prisma.skill.findMany({ orderBy: { order: "asc" } }), []);
}

export function getExperiences() {
  return safe(() => prisma.experience.findMany({ orderBy: { order: "asc" } }), []);
}

export function getExperienceById(id: string) {
  return safe(() => prisma.experience.findUnique({ where: { id } }), null);
}

export function getEducation() {
  return safe(() => prisma.education.findMany({ orderBy: { order: "asc" } }), []);
}

export function getTestimonials() {
  return safe(() => prisma.testimonial.findMany({ orderBy: { order: "asc" } }), []);
}

export function getPublishedBlogs() {
  return safe(
    () => prisma.blog.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
    [],
  );
}

export function getBlogBySlug(slug: string) {
  return safe(() => prisma.blog.findUnique({ where: { slug } }), null);
}
