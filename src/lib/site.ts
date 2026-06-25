// Central site configuration used for metadata, SEO, sitemap and JSON-LD.
// Falls back to sensible defaults so the app builds without all env vars set.

// The canonical production domain. Used as the default so SEO URLs are always
// correct in production even if NEXT_PUBLIC_SITE_URL is not set in the host.
const PRODUCTION_URL = "https://ronish-prajapati.com.np";

// Prefer the explicit env var; otherwise use the production domain in prod
// builds and localhost only during local development.
const resolvedUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000");

export const siteConfig = {
  name: "Ronish Prajapati",
  title: "Ronish Prajapati — Frontend Developer",
  description:
    "Ronish Prajapati is a frontend developer from Nepal building responsive, performant web applications with React, TypeScript, Next.js and modern frontend technologies.",
  url: resolvedUrl.replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  // Google Search Console verification token (optional).
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION,
  links: {
    github: "https://github.com/Ronish-Prajapati",
    linkedin: "https://www.linkedin.com/in/ronish-prajapati-116abb26a/",
    email: "ronishprajapati0@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
