import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import BlogGallery from "@/components/blog/BlogGallery";
import { getBlogBySlug, getPublishedBlogs, getProfile } from "@/lib/queries";
import { siteConfig } from "@/lib/site";
import { readingTime, formatDate, looksLikeHtml } from "@/lib/format";

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
    alternates: { canonical: `/blog/${blog.slug}` },
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blog, profile, allBlogs] = await Promise.all([
    getBlogBySlug(slug),
    getProfile(),
    getPublishedBlogs(),
  ]);

  if (!blog || !blog.published) notFound();

  const related = allBlogs.filter((b) => b.id !== blog.id).slice(0, 3);

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

          <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono mb-4">
            <span className="flex items-center gap-1 text-accent">
              <CalendarDays size={14} />
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {readingTime(blog.content)} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{blog.excerpt}</p>
          )}

          {blog.thumbnail && (
            <div className="relative aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-elevated">
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

          {/* Content: render rich HTML if present, else plain-text paragraphs */}
          {looksLikeHtml(blog.content) ? (
            <div
              className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-accent max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {blog.content.split(/\n{2,}/).map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Per-post photo gallery (travel & culture imagery) */}
          <BlogGallery images={blog.images} />
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-foreground mb-8">More posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-all"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono mb-2">
                    <CalendarDays size={12} /> {formatDate(b.createdAt)}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  {b.excerpt && (
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{b.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer profile={profile} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
