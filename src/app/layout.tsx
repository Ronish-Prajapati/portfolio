import type { Metadata } from "next";
import { Archivo, DM_Sans, Geist, Geist_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site";
import { getProfile } from "@/lib/queries";

// Admin panel fonts: loaded on demand only (not preloaded on public pages).
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

// Public site type system: condensed display, readable body, mono labels.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

// Runs before first paint: returning visitors in the same session get a short
// hero fade instead of the full intro sequence.
// data-js lets CSS hold the hero intro until its layers load; the timer is a
// safety net in case hydration never happens. A direct link to a section
// (/#contact) jumps there instead of gliding down the whole page; smooth
// scrolling resumes for in-page clicks once loaded.
const introScript = `(function(){var d=document.documentElement;d.dataset.js="1";try{if(sessionStorage.getItem("summit-intro"))d.dataset.intro="seen"}catch(e){}setTimeout(function(){d.dataset.heroReady="1"},4000);if(location.hash){d.style.scrollBehavior="auto";addEventListener("load",function(){setTimeout(function(){d.style.scrollBehavior=""},100)})}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Ronish Prajapati",
    "Ronish",
    "Prajapati",
    "Ronish Prajapati portfolio",
    "Ronish Prajapati developer",
    "Frontend Developer",
    "React Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "Web Developer Nepal",
    "Frontend Developer Nepal",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: siteConfig.googleVerification
    ? { google: siteConfig.googleVerification }
    : undefined,
  icons: { icon: "/favicon.png", shortcut: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();

  // Person + WebSite JSON-LD for rich results and knowledge-panel signals.
  const personId = `${siteConfig.url}/#person`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile?.name ?? siteConfig.name,
        alternateName: "Ronish",
        jobTitle: profile?.title ?? "Frontend Developer",
        description: profile?.shortDescription ?? siteConfig.description,
        url: siteConfig.url,
        email: profile?.email ?? siteConfig.links.email,
        image: profile?.profileImage ?? `${siteConfig.url}/opengraph-image`,
        nationality: "Nepali",
        knowsAbout: [
          "Frontend Development",
          "React",
          "TypeScript",
          "Next.js",
          "Tailwind CSS",
          "JavaScript",
          "Web Development",
        ],
        sameAs: [
          profile?.githubUrl ?? siteConfig.links.github,
          profile?.linkedinUrl ?? siteConfig.links.linkedin,
        ].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": personId },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceMono.variable} ${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="font-sans antialiased">
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
