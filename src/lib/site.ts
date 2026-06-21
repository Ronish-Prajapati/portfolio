// Central site configuration used for metadata, SEO, sitemap and JSON-LD.
// Falls back to sensible defaults so the app builds without all env vars set.

export const siteConfig = {
  name: "Ronish Prajapati",
  title: "Ronish Prajapati — Frontend Developer",
  description:
    "Frontend developer building responsive, performant web applications with React, TypeScript and modern frontend technologies.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/Ronish-Prajapati",
    linkedin: "https://www.linkedin.com/in/ronish-prajapati-116abb26a/",
    email: "ronishprajapati0@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
