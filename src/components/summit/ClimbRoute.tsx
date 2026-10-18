"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import topo from "@/components/landscape/topo-route.json";
import { CTA } from "@/lib/sections";

export interface ClimbEntry {
  key: string;
  anchor?: string;
  kind: "education" | "role";
  marker: string;
  period: string | null;
  title: string;
  org: string;
  location: string | null;
  description: string | null;
  highlights: string[];
  technologies: string[];
  href?: string;
  current?: boolean;
}

const routeD = "M" + (topo.route as number[][]).map(([x, y]) => `${x} ${y}`).join("L");
const ROUTE = topo.route as number[][];

/** Point at fraction t of the topo route (by arc length). */
function routePoint(t: number) {
  const lengths = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
  let remaining = Math.min(1, Math.max(0, t)) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const k = lengths[i] ? remaining / lengths[i] : 0;
      return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * k, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * k];
    }
    remaining -= lengths[i];
  }
  return ROUTE[ROUTE.length - 1];
}

export default function ClimbRoute({ entries, resumeUrl }: { entries: ClimbEntry[]; resumeUrl: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Progress = how far a line at 60% of the viewport has travelled down the list.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });

  // Where each camp marker sits along the list (0..1), measured from layout.
  const [thresholds, setThresholds] = useState<number[]>(() => entries.map((_, i) => (i + 0.1) / entries.length));
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const items = Array.from(list.querySelectorAll<HTMLElement>("[data-camp]"));
      const height = list.offsetHeight || 1;
      // Strictly increasing and inside (0, 1): required by the transform stops below.
      let previous = 0;
      setThresholds(
        items.map((el) => {
          const t = Math.min(0.995, Math.max(previous + 0.001, (el.offsetTop + 14) / height));
          previous = t;
          return t;
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [entries.length]);

  // Same initial value on server and client (hydration); effects sync it after mount.
  const [reached, setReached] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduce) setReached(thresholds.filter((t) => v >= t).length);
  });
  useEffect(() => {
    if (reduce) setReached(entries.length);
    else setReached(thresholds.filter((t) => scrollYProgress.get() >= t).length);
  }, [reduce, thresholds, entries.length, scrollYProgress]);

  // Camps sit evenly along the topo route; the summit (contact) stays ahead.
  const campFractions = useMemo(() => entries.map((_, i) => 0.12 + (0.7 * i) / Math.max(1, entries.length - 1)), [entries]);
  const mapProgress = useTransform(scrollYProgress, [0, ...thresholds, 1], [0, ...campFractions, 0.88]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const here = entries[Math.max(0, reached - 1)];
  const summit = topo.summit as number[];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
        {/* Map column: the route on the hero mountain advances camp by camp. */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[342/163] w-full" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landscape/topo.svg" alt="" className="absolute inset-0 h-full w-full opacity-45" />
              <svg viewBox={`0 0 ${topo.width} ${topo.height}`} className="absolute inset-0 h-full w-full overflow-visible">
                <path d={routeD} fill="none" stroke="rgb(var(--s-sage-400))" strokeOpacity={0.45} strokeWidth={1.1} strokeDasharray="2.5 2.5" />
                <m.path
                  d={routeD}
                  fill="none"
                  stroke="rgb(var(--s-ember-400))"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  style={{ pathLength: reduce ? 1 : mapProgress }}
                />
                {campFractions.map((f, i) => {
                  const [x, y] = routePoint(f);
                  const on = i < reached;
                  return (
                    <circle
                      key={entries[i].key}
                      cx={x}
                      cy={y}
                      r={on ? 3 : 2.4}
                      fill={on ? "rgb(var(--s-ember-400))" : "rgb(var(--s-forest-950))"}
                      stroke={on ? "rgb(var(--s-ember-400))" : "rgb(var(--s-sage-400))"}
                      strokeWidth={1}
                      style={{ transition: "all 0.4s" }}
                    />
                  );
                })}
                <circle cx={summit[0]} cy={summit[1]} r={4.2} fill="none" stroke="rgb(var(--s-snow-50))" strokeOpacity={0.7} strokeWidth={1} />
                <circle cx={summit[0]} cy={summit[1]} r={1.4} fill="rgb(var(--s-snow-50))" />
              </svg>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-snow/10 pt-5">
              <p className="min-h-[3.25rem]" aria-hidden>
                <span className="s-label block">You are here</span>
                <span className="mt-1 block text-snow">
                  {reached > 0 && here ? (
                    <>
                      {here.marker}
                      <span className="text-sage">{`, ${here.org}`}</span>
                    </>
                  ) : (
                    <span className="text-sage">At the trailhead</span>
                  )}
                </span>
              </p>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-ghost h-10 px-4 text-sm">
                <ArrowDownToLine data-nudge="down" aria-hidden />
                {CTA.resume} (PDF)
              </a>
            </div>
          </div>
        </div>

        {/* Timeline: the route line draws down as you read. */}
        <ol ref={listRef} className="relative lg:col-span-7">
          <div aria-hidden className="absolute bottom-0 left-[11px] top-3 w-px bg-[repeating-linear-gradient(to_bottom,rgb(var(--s-sage-400)/0.4)_0_6px,transparent_6px_12px)]" />
          <m.div
            aria-hidden
            className="absolute bottom-0 left-[11px] top-3 w-px origin-top bg-ember"
            style={{ scaleY: reduce ? 1 : lineScale }}
          />
          {entries.map((entry, i) => {
            const on = i < reached;
            return (
              <li key={entry.key} id={entry.anchor} data-camp className="relative scroll-mt-28 pb-16 pl-12 last:pb-2 md:pl-16">
                <span
                  aria-hidden
                  className={`absolute left-0 top-1.5 grid h-[23px] w-[23px] place-items-center rounded-full border transition-colors duration-500 ${
                    on ? "border-ember bg-forest-950" : "border-sage/50 bg-forest-950"
                  }`}
                >
                  <span className={`h-[9px] w-[9px] rounded-full transition-colors duration-500 ${on ? "bg-ember" : "bg-transparent"}`} />
                </span>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className={`s-label ${on ? "text-ember" : ""} transition-colors duration-500`}>{entry.marker}</span>
                  {entry.period ? <span className="s-label text-fog">{entry.period}</span> : null}
                  {entry.location ? <span className="s-label">{entry.location}</span> : null}
                  {entry.current ? (
                    <span className="rounded-[2px] border border-ember/50 px-1.5 py-0.5 font-label text-[0.65rem] uppercase tracking-[0.14em] text-ember">
                      Current
                    </span>
                  ) : null}
                </div>

                <h3 className="s-title mt-4 text-[clamp(1.6rem,2.6vw,2.25rem)]">{entry.title}</h3>
                <p className="mt-1 text-lg text-fog">{entry.org}</p>

                {entry.description ? <p className="s-prose mt-5 text-[1rem]">{entry.description}</p> : null}

                {entry.highlights.length > 0 ? (
                  <ul className="mt-6 grid gap-3 text-[0.95rem] leading-relaxed text-fog">
                    {entry.highlights.map((h) => (
                      <li key={h} className="relative pl-5">
                        <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ember/70" />
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.technologies.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                    {entry.technologies.map((t) => (
                      <li key={t} className="s-chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.href ? (
                  <Link href={entry.href} className="s-link mt-6 text-[0.95rem]">
                    Role details
                    <ArrowRight className="h-4 w-4" data-nudge="right" aria-hidden />
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </LazyMotion>
  );
}
