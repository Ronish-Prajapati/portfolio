import Link from "next/link";
import {
  FolderKanban,
  Wrench,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquareQuote,
  Inbox,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getCounts() {
  try {
    const [projects, skills, experience, education, blogs, testimonials, messages, unread] =
      await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.experience.count(),
        prisma.education.count(),
        prisma.blog.count(),
        prisma.testimonial.count(),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { read: false } }),
      ]);
    return { projects, skills, experience, education, blogs, testimonials, messages, unread };
  } catch {
    return {
      projects: 0,
      skills: 0,
      experience: 0,
      education: 0,
      blogs: 0,
      testimonials: 0,
      messages: 0,
      unread: 0,
    };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { href: "/admin/projects", label: "Projects", value: counts.projects, icon: FolderKanban },
    { href: "/admin/skills", label: "Skills", value: counts.skills, icon: Wrench },
    { href: "/admin/experience", label: "Experience", value: counts.experience, icon: Briefcase },
    { href: "/admin/education", label: "Education", value: counts.education, icon: GraduationCap },
    { href: "/admin/blogs", label: "Blog Posts", value: counts.blogs, icon: FileText },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      value: counts.testimonials,
      icon: MessageSquareQuote,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage every section of your portfolio.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-card border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-soft transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <card.icon size={20} />
              </div>
              <span className="text-3xl font-bold text-foreground">{card.value}</span>
            </div>
            <p className="text-muted-foreground group-hover:text-foreground transition-colors">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/messages"
        className="group flex items-center justify-between bg-card border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-soft transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Inbox size={20} />
          </div>
          <div>
            <p className="font-medium text-foreground">Contact Messages</p>
            <p className="text-sm text-muted-foreground">
              {counts.messages} total · {counts.unread} unread
            </p>
          </div>
        </div>
        {counts.unread > 0 && (
          <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            {counts.unread} new
          </span>
        )}
      </Link>
    </div>
  );
}
