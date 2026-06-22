import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock, BookOpen } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getPublishedBlogs, getProfile } from "@/lib/queries";
import { readingTime, formatDate } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and write-ups on React, TypeScript, and frontend development.",
};

export default async function BlogPage() {
  const [blogs, profile] = await Promise.all([getPublishedBlogs(), getProfile()]);

  const [featured, ...rest] = blogs;

  return (
    <main className="min-h-screen bg-background">
      <Header email={profile?.email} />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-secondary to-background">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-accent font-mono text-sm mb-3">
            <BookOpen size={16} /> Writing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground">
            Thoughts on frontend development, React, TypeScript and the projects I build.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-custom">
          {blogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              No posts yet. Check back soon!
            </p>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid lg:grid-cols-2 gap-8 items-center bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elevated transition-all duration-300 mb-12"
                >
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[260px] overflow-hidden bg-muted">
                    {featured.thumbnail ? (
                      <Image
                        src={featured.thumbnail}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/40 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/70" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                  <div className="p-6 lg:p-10">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mb-4">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} /> {formatDate(featured.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {readingTime(featured.content)} min read
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-muted-foreground mb-6 line-clamp-3">{featured.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Read article <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Rest of the posts */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {blog.thumbnail ? (
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/30 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white/70" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mb-2">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} /> {formatDate(blog.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {readingTime(blog.content)} min
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {blog.title}
                        </h2>
                        {blog.excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                            {blog.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm text-accent mt-auto">
                          Read more <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer profile={profile} />
    </main>
  );
}
