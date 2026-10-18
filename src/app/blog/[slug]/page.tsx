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
    <main className="summit s-grain min-h-screen">
      <Header email={profile?.email} resumeUrl={profile?.resumeUrl} />

      <article className="pb-16 pt-32 md:pt-40">
        <div className="s-container max-w-[52rem]">
          <Link href="/blog" className="s-link text-sm text-sage hover:text-snow">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to the blog
          </Link>

          <p className="s-label mt-10">
            <CalendarDays className="mr-2 inline h-3.5 w-3.5 align-[-2px] text-ember" aria-hidden />
            {formatDate(blog.createdAt)}
            <span className="ml-4 text-sage/80">
              <Clock className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />
              {readingTime(blog.content)} min read
            </span>
          </p>

          <h1 className="s-title mt-5 text-[clamp(2.25rem,5vw,4rem)]">{blog.title}</h1>

          {blog.excerpt ? <p className="mt-6 text-xl leading-relaxed text-fog">{blog.excerpt}</p> : null}
        </div>

        {blog.thumbnail ? (
          <div className="s-container mt-12 max-w-[64rem]">
            <div className="relative aspect-video w-full overflow-hidden rounded-[2px] border border-snow/10">
              <Image src={blog.thumbnail} alt={blog.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
            </div>
          </div>
        ) : null}

        <div className="s-container mt-14 max-w-[52rem]">
          {/* Content: render rich HTML if present, else plain-text paragraphs */}
          {looksLikeHtml(blog.content) ? (
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-snow prose-p:text-fog prose-a:text-ember prose-strong:text-snow prose-li:text-fog prose-blockquote:border-ember prose-img:rounded-[2px]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="prose prose-invert prose-lg max-w-none prose-p:text-fog">
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
        <section aria-labelledby="more-posts" className="s-container mt-10">
          <h2 id="more-posts" className="s-label border-t border-snow/10 pt-10">
            More posts
          </h2>
          <ul className="mt-6 grid gap-x-10 md:grid-cols-3">
            {related.map((b) => (
              <li key={b.id}>
                <Link href={`/blog/${b.slug}`} className="group block border-t border-snow/10 py-6">
                  <span className="s-label">{formatDate(b.createdAt)}</span>
                  <span className="s-title mt-2 line-clamp-2 block text-xl transition-colors group-hover:text-ember">{b.title}</span>
                  {b.excerpt ? <span className="mt-2 line-clamp-2 block text-sm text-sage">{b.excerpt}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
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
