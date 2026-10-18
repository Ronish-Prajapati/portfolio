"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { TechGroup, TechItem } from "@/lib/stack";

/**
 * The stack as terrain strata. Hovering, focusing or tapping a tool shows
 * where it was actually used (roles and projects), so the list stays honest
 * instead of rating skills with made-up percentages.
 */
export default function StackExplorer({ groups }: { groups: TechGroup[] }) {
  const first = groups[0]?.items[0]?.name ?? null;
  const [selected, setSelected] = useState<string | null>(first);
  const item = groups.flatMap((g) => g.items).find((i) => i.name === selected) ?? null;

  return (
    <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {groups.map((group, gi) => {
          const containsSelected = group.items.some((i) => i.name === selected);
          return (
            <div key={group.name} data-reveal style={{ "--reveal-delay": `${gi * 0.05}s` } as React.CSSProperties} className="border-t border-snow/10 py-6 md:grid md:grid-cols-[11rem_1fr] md:gap-8">
              <p className="s-label pt-2">{group.name}</p>
              <div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 md:mt-0">
                  {group.items.map((tech) => {
                    const on = tech.name === selected;
                    return (
                      <li key={tech.name}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onMouseEnter={() => setSelected(tech.name)}
                          onFocus={() => setSelected(tech.name)}
                          onClick={() => setSelected(tech.name)}
                          className={`text-left font-display text-[clamp(1.85rem,3.4vw,3rem)] font-semibold uppercase leading-[1.05] tracking-[-0.005em] transition-colors duration-300 [font-stretch:76%] [font-variation-settings:'wdth'_76] ${
                            on ? "text-ember" : "text-snow/80 hover:text-snow"
                          }`}
                        >
                          {tech.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {containsSelected && item ? (
                  <div className="mt-5 lg:hidden">
                    <Readout item={item} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 border-l border-snow/10 pl-10">{item ? <Readout item={item} /> : null}</div>
      </div>
    </div>
  );
}

function Readout({ item }: { item: TechItem }) {
  return (
    <div aria-live="polite">
      <p className="s-label">Where it shows up</p>
      <p className="s-title mt-3 text-[clamp(1.75rem,2.4vw,2.25rem)] text-ember">{item.name}</p>
      {item.usedIn.length > 0 ? (
        <ul className="mt-5 grid gap-2.5">
          {item.usedIn.map((u) => (
            <li key={u.href}>
              <Link href={u.href} className="s-link text-[0.98rem] text-fog hover:text-snow">
                {u.label}
                <ArrowRight className="h-3.5 w-3.5" data-nudge="right" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 max-w-[34ch] text-[0.98rem] leading-relaxed text-sage">
          Part of my everyday toolkit, not tied to a listed project yet.
        </p>
      )}
    </div>
  );
}
