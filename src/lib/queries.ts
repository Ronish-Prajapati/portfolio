import "server-only";
import { prisma } from "@/lib/prisma";
import {
  blogsSnapshot,
  educationSnapshot,
  experiencesSnapshot,
  gallerySnapshot,
  profileSnapshot,
  projectsSnapshot,
  skillsSnapshot,
  testimonialsSnapshot,
} from "@/lib/content-snapshot";

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
 * Public reads fall back to the published-content snapshot, so the site never
 * renders empty sections; a reachable database is always authoritative.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const reason = error instanceof Error ? error.message.trim().split("\n").pop() : String(error);
    console.warn(`[queries] database read failed, serving content snapshot: ${reason}`);
    return fallback;
  }
}

export function getProfile() {
  return safe(() => prisma.profile.findFirst(), profileSnapshot);
}

export function getProjects() {
  return safe(
    () => prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    projectsSnapshot,
  );
}

export function getProjectBySlug(slug: string) {
  return safe(
    () => prisma.project.findUnique({ where: { slug } }),
    projectsSnapshot.find((p) => p.slug === slug) ?? null,
  );
}

export function getSkills() {
  return safe(() => prisma.skill.findMany({ orderBy: { order: "asc" } }), skillsSnapshot);
}

export function getExperiences() {
  return safe(() => prisma.experience.findMany({ orderBy: { order: "asc" } }), experiencesSnapshot);
}

export function getExperienceById(id: string) {
  return safe(
    () => prisma.experience.findUnique({ where: { id } }),
    experiencesSnapshot.find((e) => e.id === id) ?? null,
  );
}

export function getEducation() {
  return safe(() => prisma.education.findMany({ orderBy: { order: "asc" } }), educationSnapshot);
}

export function getTestimonials() {
  return safe(() => prisma.testimonial.findMany({ orderBy: { order: "asc" } }), testimonialsSnapshot);
}

export function getGallery() {
  return safe(() => prisma.galleryImage.findMany({ orderBy: { order: "asc" } }), gallerySnapshot);
}

export function getPublishedBlogs() {
  return safe(
    () => prisma.blog.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
    blogsSnapshot,
  );
}

export function getBlogBySlug(slug: string) {
  return safe(
    () => prisma.blog.findUnique({ where: { slug } }),
    blogsSnapshot.find((b) => b.slug === slug) ?? null,
  );
}
