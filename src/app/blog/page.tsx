import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { getPublishedBlogs, getProfile } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and write-ups on React, TypeScript, and frontend development.",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BlogPage() {
  const [blogs, profile] = await Promise.all([getPublishedBlogs(), getProfile()]);

  return (
    <main className="min-h-screen bg-background">
      <Header email={profile?.email} />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <p className="text-accent font-mono text-sm mb-3">Writing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground">
            Thoughts on frontend development, React, TypeScript and the projects I build.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {blogs.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevated transition-all duration-300 flex flex-col"
                >
                  {blog.thumbnail && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono mb-2">
                      <CalendarDays size={13} />
                      {formatDate(blog.createdAt)}
                    </span>
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
        </div>
      </section>

      <Footer profile={profile} />
    </main>
  );
}
