import type { CSSProperties } from "react";
import type { Experience, Profile, Project, Skill } from "@prisma/client";
import StackExplorer from "@/components/summit/StackExplorer";
import { SectionHeading } from "@/components/summit/SectionHeading";
import { getLucideIcon } from "@/lib/icons";
import { buildStack } from "@/lib/stack";

interface TechTerrainProps {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
}

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const TechTerrain = ({ profile, skills, projects, experiences }: TechTerrainProps) => {
  const groups = buildStack(profile?.techStack ?? [], projects, experiences);

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url(/landscape/topo.svg)] bg-[length:140%_auto] bg-[position:70%_40%] bg-no-repeat opacity-[0.06]"
      />
      <div className="s-container relative">
        <SectionHeading id="stack-title" title="Technical terrain" className="mb-14 md:mb-20">
          The tools I work with, grouped by where they sit in a project. Pick one to see where it shows up.
        </SectionHeading>

        {groups.length > 0 ? <StackExplorer groups={groups} /> : null}

        {skills.length > 0 ? (
          <div className="mt-24 md:mt-32">
            <h3 data-reveal className="s-title text-[clamp(1.6rem,2.6vw,2.25rem)]">
              How I work
            </h3>
            <ul className="mt-10 grid gap-x-16 md:grid-cols-2">
              {skills.map((skill, i) => {
                const Icon = getLucideIcon(skill.icon);
                return (
                  <li key={skill.id} data-reveal style={delay(0.06 * i)} className="flex gap-5 border-t border-snow/10 py-7">
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-ember" strokeWidth={1.75} aria-hidden />
                    <div>
                      <p className="text-lg font-medium text-snow">{skill.name}</p>
                      {skill.description ? <p className="mt-2 max-w-[48ch] leading-relaxed text-sage">{skill.description}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default TechTerrain;
