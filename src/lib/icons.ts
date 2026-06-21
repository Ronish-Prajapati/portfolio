import { icons, type LucideIcon, Sparkles } from "lucide-react";

/**
 * Resolve a lucide icon by its PascalCase name (as stored on Skill.icon).
 * Falls back to a neutral icon when the name is empty or unknown.
 */
export function getLucideIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return (icons as Record<string, LucideIcon>)[name] ?? Sparkles;
}
