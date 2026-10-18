import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getPublishedBlogs, getProfile } from "@/lib/queries";
import { readingTime, formatDate } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles and write-ups by Ronish Prajapati on React, TypeScript, frontend development, travel and culture.",
  alternates: { canonical: "/blog" },
};

function Cover({ src, alt, sizes, priority = false }: { src: string | null; alt: string; sizes: string; priority?: boolean }) {
  return src ? (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  ) : (
    <div aria-hidden className="absolute inset-0 bg-forest-900">
      <div className="absolute inset-0 bg-[url(/landscape/topo.svg)] bg-[length:180%_auto] bg-center bg-no-repeat opacity-30" />
    </div>
  );
}

export default async function BlogPage() {
  const [blogs, profile] = await Promise.all([getPublishedBlogs(), getProfile()]);
  const [featured, ...rest] = blogs;

  return (
    <main className="summit s-grain min-h-screen">
      <Header email={profile?.email} resumeUrl={profile?.resumeUrl} />

      <header className="s-container pb-16 pt-32 md:pt-40">
        <h1 className="s-display text-[clamp(3.5rem,10vw,8.5rem)]">Blog</h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-sage">
          Thoughts on frontend development, React, TypeScript and the projects I build.
        </p>
      </header>

      <section className="s-container pb-12" aria-label="Posts">
        {blogs.length === 0 ? (
          <p className="max-w-md border-t border-snow/10 pt-6 text-sage">No posts yet. Check back soon!</p>
        ) : (
          <>
            {featured ? (
              <Link href={`/blog/${featured.slug}`} className="group grid items-center gap-10 border-t border-snow/10 pt-10 lg:grid-cols-12">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] border border-snow/10 lg:col-span-7">
                  <Cover src={featured.thumbnail} alt={featured.title} sizes="(max-width: 1024px) 100vw, 800px" priority />
                </div>
                <div className="lg:col-span-5">
                  <p className="s-label">
                    {formatDate(featured.createdAt)}
                    <span className="ml-4 text-sage/80">{readingTime(featured.content)} min read</span>
                  </p>
                  <h2 className="s-title mt-4 text-[clamp(1.9rem,3.2vw,3rem)] transition-colors group-hover:text-ember">{featured.title}</h2>
                  {featured.excerpt ? <p className="mt-4 line-clamp-3 leading-relaxed text-fog">{featured.excerpt}</p> : null}
                  <span className="s-link mt-6 text-[0.95rem]">
                    Read article
                    <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
                  </span>
                </div>
              </Link>
            ) : null}

            {rest.length > 0 ? (
              <ul className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((blog) => (
                  <li key={blog.id}>
                    <Link href={`/blog/${blog.slug}`} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] border border-snow/10">
                        <Cover src={blog.thumbnail} alt={blog.title} sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <p className="s-label mt-5">
                        {formatDate(blog.createdAt)}
                        <span className="ml-4 text-sage/80">{readingTime(blog.content)} min</span>
                      </p>
                      <h2 className="s-title mt-3 text-2xl transition-colors group-hover:text-ember">{blog.title}</h2>
                      {blog.excerpt ? <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-sage">{blog.excerpt}</p> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </section>

      <Footer profile={profile} />
    </main>
  );
}
