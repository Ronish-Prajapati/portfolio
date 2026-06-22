import type { ZodSchema } from "zod";
import {
  projectSchema,
  skillSchema,
  experienceSchema,
  educationSchema,
  blogSchema,
  testimonialSchema,
  gallerySchema,
} from "@/lib/validations";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "editor"
  | "number"
  | "boolean"
  | "list"
  | "image"
  | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
}

export interface ListColumn {
  key: string;
  label: string;
  type?: "text" | "boolean";
}

export interface ResourceConfig {
  key: string;
  label: string; // plural, e.g. "Projects"
  singular: string; // e.g. "Project"
  schema: ZodSchema;
  fields: FieldConfig[];
  listColumns: ListColumn[];
  /** Public paths to revalidate after a mutation. */
  revalidate: string[];
}

export const resources: Record<string, ResourceConfig> = {
  projects: {
    key: "projects",
    label: "Projects",
    singular: "Project",
    schema: projectSchema,
    revalidate: ["/", "/projects"],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "year", label: "Year" },
      { key: "featured", label: "Featured", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        help: "URL identifier, e.g. my-cool-project (lowercase, hyphens).",
      },
      { name: "description", label: "Short Description", type: "textarea", required: true },
      { name: "longDescription", label: "Long Description", type: "richtext", required: true },
      { name: "image", label: "Cover Image", type: "image" },
      {
        name: "technologies",
        label: "Technologies",
        type: "list",
        help: "One per line (or comma separated).",
      },
      {
        name: "features",
        label: "Key Features",
        type: "list",
        help: "One feature per line.",
      },
      { name: "liveLink", label: "Live URL", type: "url" },
      { name: "githubLink", label: "GitHub URL", type: "url" },
      { name: "year", label: "Year", type: "text" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number", help: "Lower numbers show first." },
    ],
  },
  skills: {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    schema: skillSchema,
    revalidate: ["/"],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "proficiency", label: "Proficiency" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      {
        name: "icon",
        label: "Icon",
        type: "text",
        help: "A lucide-react icon name (e.g. Code2, Layout, Zap, Sparkles).",
      },
      { name: "description", label: "Description", type: "textarea" },
      { name: "proficiency", label: "Proficiency (0-100)", type: "number" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  experience: {
    key: "experience",
    label: "Experience",
    singular: "Experience",
    schema: experienceSchema,
    revalidate: ["/", "/experience"],
    listColumns: [
      { key: "position", label: "Position" },
      { key: "company", label: "Company" },
      { key: "current", label: "Current", type: "boolean" },
    ],
    fields: [
      { name: "position", label: "Position", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "period", label: "Period", type: "text", help: 'e.g. "July 2024 - Present"' },
      { name: "description", label: "Description", type: "richtext", required: true },
      { name: "highlights", label: "Key Achievements", type: "list", help: "One achievement per line." },
      { name: "technologies", label: "Technologies", type: "list", help: "Comma or newline separated." },
      { name: "current", label: "Current Role", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  education: {
    key: "education",
    label: "Education",
    singular: "Education",
    schema: educationSchema,
    revalidate: ["/"],
    listColumns: [
      { key: "degree", label: "Degree" },
      { key: "institution", label: "Institution" },
    ],
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "startYear", label: "Start Year", type: "text", required: true },
      { name: "endYear", label: "End Year", type: "text" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  blogs: {
    key: "blogs",
    label: "Blogs",
    singular: "Blog Post",
    schema: blogSchema,
    revalidate: ["/", "/blog"],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "published", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", help: "Short summary shown on the blog list." },
      { name: "content", label: "Content", type: "editor", required: true },
      { name: "thumbnail", label: "Thumbnail", type: "image" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    schema: testimonialSchema,
    revalidate: ["/"],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "message", label: "Message", type: "textarea", required: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  gallery: {
    key: "gallery",
    label: "Gallery",
    singular: "Gallery Image",
    schema: gallerySchema,
    revalidate: ["/"],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "image", label: "Image", type: "image", required: true },
      { name: "title", label: "Title", type: "text" },
      { name: "caption", label: "Caption", type: "textarea" },
      { name: "order", label: "Order", type: "number", help: "Lower numbers show first." },
    ],
  },
};

// Field config for the singleton Profile (drives Hero / About / Footer).
// Kept here (not in the "use server" actions file, which may only export functions).
export const profileFields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "shortDescription", label: "Short Description", type: "textarea", required: true },
  { name: "about", label: "About (lead paragraph)", type: "textarea", required: true },
  {
    name: "aboutParagraphs",
    label: "About — extra paragraphs",
    type: "list",
    help: "One paragraph per line.",
  },
  { name: "techStack", label: "Tech Stack", type: "list", help: "One per line." },
  { name: "heroGreeting", label: "Hero — Greeting", type: "text" },
  { name: "heroHeadline", label: "Hero — Headline", type: "text" },
  { name: "heroHighlight", label: "Hero — Highlighted Word", type: "text" },
  { name: "heroSubtitle", label: "Hero — Subtitle", type: "textarea" },
  { name: "heroImage", label: "Hero — Background Image", type: "image" },
  { name: "profileImage", label: "Profile Image", type: "image" },
  { name: "resumeUrl", label: "Resume URL", type: "text", help: "e.g. /ronish-frontend.pdf" },
  { name: "githubUrl", label: "GitHub URL", type: "url" },
  { name: "linkedinUrl", label: "LinkedIn URL", type: "url" },
];

export function getResource(key: string): ResourceConfig | null {
  return resources[key] ?? null;
}

export const resourceList = Object.values(resources);
