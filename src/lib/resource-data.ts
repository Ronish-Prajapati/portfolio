import "server-only";
import { prisma } from "@/lib/prisma";

// Minimal delegate shape shared by all Prisma models we expose generically.
interface Delegate {
  findMany: (args?: unknown) => Promise<Record<string, unknown>[]>;
  findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
  create: (args: unknown) => Promise<Record<string, unknown>>;
  update: (args: unknown) => Promise<Record<string, unknown>>;
  delete: (args: unknown) => Promise<Record<string, unknown>>;
  count: (args?: unknown) => Promise<number>;
}

const delegates: Record<string, Delegate> = {
  projects: prisma.project as unknown as Delegate,
  skills: prisma.skill as unknown as Delegate,
  experience: prisma.experience as unknown as Delegate,
  education: prisma.education as unknown as Delegate,
  blogs: prisma.blog as unknown as Delegate,
  testimonials: prisma.testimonial as unknown as Delegate,
};

export function getDelegate(key: string): Delegate | null {
  return delegates[key] ?? null;
}

export async function listResource(key: string): Promise<Record<string, unknown>[]> {
  const delegate = getDelegate(key);
  if (!delegate) return [];
  // Order by `order` then recency where the column exists; fall back gracefully.
  try {
    return await delegate.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  } catch {
    return delegate.findMany({ orderBy: { createdAt: "desc" } });
  }
}

export async function getResourceItem(
  key: string,
  id: string,
): Promise<Record<string, unknown> | null> {
  const delegate = getDelegate(key);
  if (!delegate) return null;
  return delegate.findUnique({ where: { id } });
}
