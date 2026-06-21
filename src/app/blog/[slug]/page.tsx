import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getBlogBySlug, getPublishedBlogs, getProfile } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog || !blog.published) return { title: "Post not found" };

  return {
    title: blog.title,
    description: blog.excerpt ?? blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt ?? blog.title,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      url: `${siteConfig.url}/blog/${blog.slug}`,
      images: blog.thumbnail ? [{ url: blog.thumbnail }] : undefined,
    },
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blog, profile] = await Promise.all([getBlogBySlug(slug), getProfile()]);

  if (!blog || !blog.published) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt ?? blog.title,
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: { "@type": "Person", name: profile?.name ?? siteConfig.name },
    image: blog.thumbnail ?? undefined,
    url: `${siteConfig.url}/blog/${blog.slug}`,
  };

  return (
    <main className="min-h-screen bg-background">
      <Header email={profile?.email} />

      <article className="pt-32 pb-16">
        <div className="container-custom max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <span className="flex items-center gap-1 text-sm text-accent font-mono mb-4">
            <CalendarDays size={14} />
            {formatDate(blog.createdAt)}
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8">{blog.title}</h1>

          {blog.thumbnail && (
            <div className="relative aspect-video w-full mb-10 rounded-2xl overflow-hidden">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content rendered as paragraphs preserving line breaks */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            {blog.content.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i} className="mb-6 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <Footer profile={profile} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
