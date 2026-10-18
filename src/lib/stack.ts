import type { Experience, Project } from "@prisma/client";

export interface TechUsage {
  label: string;
  href: string;
}

export interface TechItem {
  name: string;
  usedIn: TechUsage[];
}

export interface TechGroup {
  name: string;
  items: TechItem[];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** "Zustand & Redux Toolkit" -> ["zustand", "reduxtoolkit"] */
const atoms = (name: string) =>
  name
    .split(/\s*(?:&|,|\/|\band\b)\s*/i)
    .map(norm)
    .filter(Boolean);

// Where a technology sits in a project. Unknown entries fall into "Also".
const GROUPS: { name: string; match: string[] }[] = [
  { name: "Interface", match: ["react", "nextjs", "typescript", "javascript", "html", "html5", "vue", "svelte"] },
  { name: "Styling", match: ["tailwindcss", "tailwind", "css", "css3", "sass", "scss", "bootstrap", "shadcnui"] },
  {
    name: "State and data",
    match: ["zustand", "reduxtoolkit", "redux", "tanstackquery", "reactquery", "restapis", "restapi", "graphql", "inertiajs"],
  },
  { name: "Back end and platforms", match: ["laravel", "php", "mysql", "postgresql", "prisma", "moodlelms", "moodle", "nodejs", "node"] },
  { name: "Workflow", match: ["git", "github", "vite", "docker", "figma", "vercel"] },
];

const shortTitle = (title: string) => title.split(/\s[–-]\s|\s\(/)[0].trim();
const shortRole = (position: string) => position.split("(")[0].trim();

/** Group the profile tech stack and record where each tool shows up in real work. */
export function buildStack(techStack: string[], projects: Project[], experiences: Experience[]): TechGroup[] {
  const groups = new Map<string, TechItem[]>();
  for (const name of techStack) {
    const keys = atoms(name);
    const usedIn: TechUsage[] = [
      ...experiences
        .filter((e) => e.technologies.some((t) => keys.includes(norm(t))))
        .map((e) => ({ label: `${shortRole(e.position)}, ${e.company}`, href: `/experience/${e.id}` })),
      ...projects
        .filter((p) => p.technologies.some((t) => keys.includes(norm(t))))
        .map((p) => ({ label: shortTitle(p.title), href: `/projects/${p.slug}` })),
    ];
    const group = GROUPS.find((g) => keys.some((k) => g.match.includes(k)))?.name ?? "Also";
    groups.set(group, [...(groups.get(group) ?? []), { name, usedIn }]);
  }
  const order = [...GROUPS.map((g) => g.name), "Also"];
  return order.filter((g) => groups.has(g)).map((g) => ({ name: g, items: groups.get(g)! }));
}
