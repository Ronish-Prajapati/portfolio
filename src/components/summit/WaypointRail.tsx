"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import type { SectionWaypoint } from "@/lib/sections";

/**
 * Trail-marker progress rail on wide screens: one waypoint per section, the
 * current one lit. Hidden over the hero so the landscape stays clean.
 */
export default function WaypointRail({ sections }: { sections: SectionWaypoint[] }) {
  const active = useActiveSection(sections.map((s) => s.id));
  const activeIndex = sections.findIndex((s) => s.id === active);

  return (
    <nav
      aria-label="Section waypoints"
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 2xl:right-8 xl:block ${
        activeIndex === -1 ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <ol className="relative flex flex-col gap-5">
        <span aria-hidden className="absolute bottom-2 right-[5px] top-2 w-px bg-snow/15" />
        <span
          aria-hidden
          className="absolute right-[5px] top-2 w-px origin-top bg-ember transition-[height] duration-500 ease-out"
          style={{ height: activeIndex <= 0 ? 0 : `calc(${(activeIndex / (sections.length - 1)) * 100}% - 0.5rem)` }}
        />
        {sections.map((section, i) => {
          const current = i === activeIndex;
          const passed = i < activeIndex;
          return (
            <li key={section.id} className="relative">
              <a
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                tabIndex={activeIndex === -1 ? -1 : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={`font-label text-[0.66rem] uppercase tracking-[0.14em] transition-all duration-300 ${
                    current
                      ? "translate-x-1 text-snow opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 min-[1700px]:translate-x-0 min-[1700px]:opacity-100"
                      : "translate-x-1 text-sage opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  }`}
                >
                  {section.waypoint}
                </span>
                <span
                  aria-hidden
                  className={`relative block h-[11px] w-[11px] rotate-45 border transition-colors duration-300 ${
                    current ? "border-ember bg-ember" : passed ? "border-ember bg-forest-950" : "border-snow/40 bg-forest-950"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
