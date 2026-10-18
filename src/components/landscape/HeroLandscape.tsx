"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import scene from "./hero-scene.json";
import { CTA } from "@/lib/sections";

type Point = [number, number];

export interface HeroWaypoint {
  href: string;
  label: string;
  /** Position along the route, 0 (trail start) to 1 (summit). */
  at: number;
}

interface HeroLandscapeProps {
  firstName: string;
  lastName: string;
  roleLead: string;
  roleHighlight?: string | null;
  waypoints: HeroWaypoint[];
}

// Depth-ordered layers rendered from scripts/landscape. `depth` scales pointer
// parallax, `scroll` is how far (in % of stage height) a layer lags while the
// hero scrolls away, `dolly` is the intro's starting pose. Phones and tablets
// get lower-resolution variants (see `sizes`): the layers are soft and
// painterly, so full device resolution would only cost bandwidth.
const LAYERS = [
  { key: "sky", depth: 0.06, scroll: 36, z: 1, dolly: { y: "0%", s: 1.02 } },
  { key: "far", depth: 0.14, scroll: 31, z: 2, dolly: { y: "2%", s: 1.04 } },
  { key: "massif", depth: 0.3, scroll: 23, z: 4, dolly: { y: "5%", s: 1.05 } },
  { key: "ridge", depth: 0.58, scroll: 12, z: 5, dolly: { y: "3%", s: 1.12 } },
  { key: "fore", depth: 1, scroll: 0, z: 7, dolly: { y: "0%", s: 1.3 } },
] as const;

const SEGMENTS = scene.route as Point[][];
const STAGE = { w: scene.width, h: scene.height };

const segmentLength = (seg: Point[]) =>
  seg.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - seg[i - 1][0], p[1] - seg[i - 1][1]) : 0), 0);
const SEGMENT_LENGTHS = SEGMENTS.map(segmentLength);
const ROUTE_LENGTH = SEGMENT_LENGTHS.reduce((a, b) => a + b, 0);

/** Point at fraction t (0..1) of the visible route length. */
function pointAt(t: number): Point {
  let remaining = Math.min(1, Math.max(0, t)) * ROUTE_LENGTH;
  for (const seg of SEGMENTS) {
    for (let i = 1; i < seg.length; i++) {
      const d = Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]);
      if (remaining <= d) {
        const k = d === 0 ? 0 : remaining / d;
        return [seg[i - 1][0] + (seg[i][0] - seg[i - 1][0]) * k, seg[i - 1][1] + (seg[i][1] - seg[i - 1][1]) * k];
      }
      remaining -= d;
    }
  }
  const last = SEGMENTS[SEGMENTS.length - 1];
  return last[last.length - 1];
}

const pathD = (seg: Point[]) => "M" + seg.map(([x, y]) => `${x} ${y}`).join("L");

// Intro timing (seconds), mirrored in globals.css.
const DRAW_START = 1.5;
const DRAW_DURATION = 2.2;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export default function HeroLandscape({ firstName, lastName, roleLead, roleHighlight, waypoints }: HeroLandscapeProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;

  // The intro waits (behind the cloud veil) until every layer has loaded, so
  // the mountains never pop in mid-sequence. Capped so slow networks still
  // get content quickly; a pre-paint timer in the layout is the last resort.
  const [ready, setReady] = useState(false);
  const loaded = useRef(new Set<string>());
  const onLayerLoad = useCallback((key: string) => {
    loaded.current.add(key);
    if (loaded.current.size >= LAYERS.length) setReady(true);
  }, []);
  useEffect(() => {
    const images = Array.from(ref.current?.querySelectorAll<HTMLImageElement>(".hero-stage img") ?? []);
    if (images.length > 0 && images.every((img) => img.complete && img.naturalWidth > 0)) setReady(true);
    const cap = window.setTimeout(() => setReady(true), 2600);
    return () => window.clearTimeout(cap);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 45, damping: 18, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 45, damping: 18, mass: 0.7 });

  // After the intro has played once, later visits in this session skip it.
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem("summit-intro", "1");
      } catch {
        /* storage unavailable: intro simply plays again */
      }
      document.documentElement.dataset.intro = "seen";
    }, (DRAW_START + DRAW_DURATION + 0.8) * 1000);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pause the drifting mist while the hero is off screen.
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.offscreen = String(!entry.isIntersecting);
    });
    observer.observe(el);

    // Pointer parallax for fine pointers only.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [pointerX, pointerY, reduce]);

  const nameProgress = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const nameTransform = useParallax(scrollYProgress, springX, springY, 0.22, 20);
  const veilFromScroll = useTransform(scrollYProgress, [0.25, 0.95], [0, 1]);
  // The intro copy hands over to the trailhead (which repeats its actions) as the hero leaves.
  const contentOpacity = useTransform(scrollYProgress, [0.12, 0.45], [1, 0]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        ref={ref}
        id="top"
        data-ready={ready ? "true" : "false"}
        aria-labelledby="hero-title"
        className="hero relative h-[100svh] min-h-[560px] overflow-hidden bg-night"
      >
        <div className="hero-stage">
          {LAYERS.map((layer) => (
            <ParallaxLayer
              key={layer.key}
              z={layer.z}
              depth={layer.depth}
              scroll={layer.scroll}
              progress={scrollYProgress}
              px={springX}
              py={springY}
              reduce={reduce}
            >
              <div
                className={layer.key === "sky" ? "hero-intro hero-sky" : "hero-intro"}
                style={vars({
                  "--dolly-y": layer.dolly.y,
                  "--dolly-s": layer.dolly.s,
                  "--dolly-delay": layer.key === "fore" ? "0s" : "0.05s",
                })}
              >
                <Image
                  src={`/landscape/hero-${layer.key}.webp`}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 767px) 70vh, (max-width: 1023px) 100vh, (max-aspect-ratio: 16/9) 178vh, 100vw"
                  quality={layer.key === "sky" ? 85 : 80}
                  className="pointer-events-none select-none object-cover"
                  draggable={false}
                  onLoad={() => onLayerLoad(layer.key)}
                />
                {layer.key === "massif" ? <Route waypoints={waypoints} /> : null}
              </div>
            </ParallaxLayer>
          ))}

          {/* Valley mist drifting between the mid ridge and the foreground forest. */}
          <ParallaxLayer z={6} depth={0.75} scroll={8} progress={scrollYProgress} px={springX} py={springY} reduce={reduce}>
            <div className="absolute inset-x-0 top-[57%] h-[16%] overflow-hidden opacity-[0.22] mix-blend-screen">
              <div className="mist-track" style={vars({ backgroundImage: "url(/landscape/mist.webp)", "--mist-speed": "150s" })} />
            </div>
          </ParallaxLayer>
        </div>

        {/* Name sits between the far range and the massif: the summit rises in front of it. */}
        <m.h1
          id="hero-title"
          className="hero-name s-display absolute inset-x-0 z-[3]"
          style={reduce ? undefined : { transform: nameTransform, opacity: nameProgress }}
        >
          <span className="s-container block md:flex md:flex-nowrap md:gap-x-[0.2em] md:whitespace-nowrap">
            <span className="hero-name-line block overflow-hidden pb-[0.04em]">
              <span>{firstName}</span>
            </span>{" "}
            <span className="hero-name-line block overflow-hidden pb-[0.04em]">
              <span style={vars({ "--rise-delay": "0.9s" })}>{lastName}</span>
            </span>
          </span>
        </m.h1>

        {/* Intro veil: the scene begins in cloud, then clears. */}
        <div aria-hidden className="hero-veil pointer-events-none absolute inset-0 z-[8] bg-forest-900">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_60%_35%,rgb(var(--s-fog-200)/0.18),transparent_70%)]" />
        </div>

        {/* Scroll-out: the forest floor fades into the trailhead below. */}
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[9] bg-forest-950"
          style={{ opacity: reduce ? 0 : veilFromScroll }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[18%] bg-gradient-to-b from-transparent to-forest-950"
        />

        <m.div className="absolute inset-x-0 bottom-0 z-10 pb-[max(2.25rem,7svh)]" style={reduce ? undefined : { opacity: contentOpacity }}>
          <div className="s-container">
            <p
              className="hero-fade max-w-[32ch] text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-snug text-snow"
              style={vars({ "--fade-delay": "1.25s" })}
            >
              {roleLead} building with{" "}
              {roleHighlight ? <span className="text-ember">{roleHighlight}</span> : null}
            </p>
            <div className="hero-fade mt-6 flex flex-wrap gap-3" style={vars({ "--fade-delay": "1.4s" })}>
              <a href="#projects" className="s-btn s-btn-primary">
                {CTA.work}
                <ArrowDown data-nudge="down" aria-hidden />
              </a>
              <a href="#contact" className="s-btn s-btn-ghost backdrop-blur-sm">
                {CTA.contact}
              </a>
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}

function useParallax(
  progress: MotionValue<number>,
  px: MotionValue<number>,
  py: MotionValue<number>,
  depth: number,
  scroll: number,
) {
  return useTransform([progress, px, py], ([p, x, y]: number[]) => {
    const dx = -x * depth * 30;
    const dy = -y * depth * 16;
    return `translate3d(${dx.toFixed(2)}px, calc(${(p * scroll).toFixed(3)}% + ${dy.toFixed(2)}px), 0)`;
  });
}

function ParallaxLayer({
  children,
  z,
  depth,
  scroll,
  progress,
  px,
  py,
  reduce,
}: {
  children: ReactNode;
  z: number;
  depth: number;
  scroll: number;
  progress: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
  reduce: boolean;
}) {
  const transform = useParallax(progress, px, py, depth, scroll);
  return (
    <m.div
      aria-hidden
      className="hero-layer"
      style={reduce ? { zIndex: z } : { zIndex: z, transform, willChange: "transform" }}
    >
      {children}
    </m.div>
  );
}

/** The trail on the massif: dashed route drawn in on load, with waypoint links. */
function Route({ waypoints }: { waypoints: HeroWaypoint[] }) {
  let offset = 0;
  const timings = SEGMENT_LENGTHS.map((len) => {
    const start = DRAW_START + (offset / ROUTE_LENGTH) * DRAW_DURATION;
    offset += len;
    return { start, duration: (len / ROUTE_LENGTH) * DRAW_DURATION };
  });
  const summit = pointAt(1);

  return (
    <>
      <svg
        viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <mask id="route-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={STAGE.w} height={STAGE.h}>
            {SEGMENTS.map((seg, i) => (
              <path
                key={i}
                d={pathD(seg)}
                pathLength={1}
                className="hero-route-draw"
                fill="none"
                stroke="#fff"
                strokeWidth={16}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animationDelay: `${timings[i].start}s`, animationDuration: `${timings[i].duration}s` }}
              />
            ))}
          </mask>
        </defs>
        <g mask="url(#route-reveal)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {SEGMENTS.map((seg, i) => (
            <path key={`shadow-${i}`} d={pathD(seg)} stroke="rgb(var(--s-forest-950))" strokeOpacity={0.45} strokeWidth={9} />
          ))}
          {SEGMENTS.map((seg, i) => (
            <path key={`trail-${i}`} d={pathD(seg)} stroke="rgb(var(--s-ember-400))" strokeWidth={4.5} strokeDasharray="13 11" />
          ))}
        </g>
        {waypoints.map((w) => {
          const [x, y] = pointAt(w.at);
          const isSummit = w.at >= 1;
          return (
            <g
              key={w.href}
              className="hero-waypoint"
              style={vars({ "--pop-delay": `${DRAW_START + w.at * DRAW_DURATION}s` })}
            >
              {isSummit ? <circle cx={x} cy={y} r={22} fill="none" stroke="rgb(var(--s-ember-400))" strokeOpacity={0.5} strokeWidth={2.5} /> : null}
              <circle cx={x} cy={y} r={isSummit ? 10 : 8} fill="rgb(var(--s-forest-950))" stroke="rgb(var(--s-ember-400))" strokeWidth={4} />
            </g>
          );
        })}
        {/* Summit marker stays put even if the summit is not a listed waypoint. */}
        <circle cx={summit[0]} cy={summit[1]} r={3} fill="rgb(var(--s-ember-300))" />
      </svg>

      {waypoints.filter((w) => w.at < 1).map((w, i) => {
        const [x, y] = pointAt(w.at);
        return (
          <a
            key={w.href}
            href={w.href}
            tabIndex={-1}
            className="group pointer-events-auto absolute max-md:hidden"
            style={{
              left: `${(x / STAGE.w) * 100}%`,
              top: `${(y / STAGE.h) * 100}%`,
              transform: i % 2 ? "translate(0.9rem, -50%)" : "translate(calc(-100% - 0.9rem), -50%)",
            }}
          >
            <span
              className="hero-tag block whitespace-nowrap rounded-[2px] bg-forest-950/70 px-2 py-1 font-label text-[0.66rem] uppercase tracking-[0.14em] text-snow backdrop-blur-sm transition-colors group-hover:bg-forest-950/90 group-hover:text-ember"
              style={vars({ "--pop-delay": `${DRAW_START + w.at * DRAW_DURATION + 0.15}s` })}
            >
              {w.label}
            </span>
          </a>
        );
      })}
    </>
  );
}
