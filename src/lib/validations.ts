import { z } from "zod";

// Helpers ---------------------------------------------------------------------

/**
 * Tag-style fields: split on commas OR newlines. Use for short items
 * (technologies, tech stack) where each value is a word/short phrase.
 */
const stringArray = z
  .union([z.array(z.string()), z.string()])
  .transform((val) =>
    (Array.isArray(val) ? val : val.split(/[\n,]/))
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string()));

/**
 * Line-style fields: split on NEWLINES ONLY (one item per line). Use for
 * sentences/paragraphs/bullets that naturally contain commas
 * (about paragraphs, experience highlights, project features).
 */
const lineArray = z
  .union([z.array(z.string()), z.string()])
  .transform((val) =>
    (Array.isArray(val) ? val : val.split(/\r?\n/))
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string()));

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional()
  .nullable();

// Auth ------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Profile ---------------------------------------------------------------------

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  about: z.string().min(1, "About is required"),
  aboutParagraphs: lineArray.optional().default([]),
  techStack: stringArray.optional().default([]),
  profileImage: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional().nullable(),
  heroGreeting: z.string().optional().nullable(),
  heroHeadline: z.string().optional().nullable(),
  heroHighlight: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

// Project ---------------------------------------------------------------------

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  image: z.string().optional().nullable(),
  githubLink: z.string().optional().nullable(),
  liveLink: z.string().optional().nullable(),
  technologies: stringArray.optional().default([]),
  features: lineArray.optional().default([]),
  year: z.string().optional().nullable(),
  featured: z.coerce.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});
export type ProjectInput = z.infer<typeof projectSchema>;

// Skill -----------------------------------------------------------------------

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  proficiency: z.coerce.number().int().min(0).max(100).optional().default(80),
  order: z.coerce.number().int().optional().default(0),
});
export type SkillInput = z.infer<typeof skillSchema>;

// Experience ------------------------------------------------------------------

export const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional().nullable(),
  period: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  highlights: lineArray.optional().default([]),
  technologies: stringArray.optional().default([]),
  current: z.coerce.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

// Education -------------------------------------------------------------------

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  description: z.string().optional().nullable(),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
});
export type EducationInput = z.infer<typeof educationSchema>;

// Blog ------------------------------------------------------------------------

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional().nullable(),
  images: lineArray.optional().default([]),
  published: z.coerce.boolean().optional().default(false),
});
export type BlogInput = z.infer<typeof blogSchema>;

// Testimonial -----------------------------------------------------------------

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  message: z.string().min(1, "Message is required"),
  image: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

// Gallery ---------------------------------------------------------------------

export const gallerySchema = z.object({
  title: z.string().optional().nullable(),
  image: z.string().min(1, "An image is required"),
  caption: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
});
export type GalleryInput = z.infer<typeof gallerySchema>;

// Contact ---------------------------------------------------------------------

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  // Honeypot: must stay empty. Bots tend to fill every field.
  website: z.string().max(0, "Spam detected").optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Lightweight HTML sanitizer for rich-text content produced by the admin editor.
 * Tiptap's StarterKit only emits safe tags, but we still strip script/style,
 * inline event handlers and javascript: URLs as defense in depth before storing.
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1=$2#$2');
}

/** Generate a URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
