import { icons, type LucideIcon, Sparkles } from "lucide-react";

/**
 * Resolve a lucide icon by its PascalCase name (as stored on Skill.icon).
 * Falls back to a neutral icon when the name is empty or unknown.
 */
// Older lucide names still stored in the CMS, mapped to their current names.
const ALIASES: Record<string, string> = {
  Code2: "CodeXml",
  Layout: "LayoutTemplate",
};

export function getLucideIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  const lookup = icons as Record<string, LucideIcon>;
  return lookup[name] ?? lookup[ALIASES[name] ?? ""] ?? Sparkles;
}
