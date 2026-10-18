import Image from "next/image";
import type { ReactNode } from "react";
import vista from "./summit-scene.json";

type Point = [number, number];

const SEGMENTS = vista.route as Point[][];
const pathD = (seg: Point[]) => "M" + seg.map(([x, y]) => `${x} ${y}`).join("L");

/**
 * The bookend to the hero: the same mountain after sunrise, seen closer, with
 * the whole route walked and the summit beacon lit. Children (the headline)
 * sit in the sky above the peak.
 */
export default function SummitVista({ children }: { children: ReactNode }) {
  const [sx, sy] = vista.summit;

  return (
    <div className="vista relative h-[clamp(30rem,82svh,54rem)] overflow-hidden">
      <div className="vista-stage" aria-hidden>
        <Image
          src="/landscape/summit.webp"
          alt=""
          fill
          sizes="(max-width: 767px) 120vw, (max-aspect-ratio: 16/9) 140vh, 100vw"
          className="pointer-events-none select-none object-cover"
        />
        <div data-reveal="draw" className="absolute inset-0">
          <svg viewBox={`0 0 ${vista.width} ${vista.height}`} className="absolute inset-0 h-full w-full">
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              {SEGMENTS.map((seg, i) => (
                <path key={`s${i}`} d={pathD(seg)} stroke="rgb(var(--s-forest-950))" strokeOpacity={0.4} strokeWidth={8} />
              ))}
              {SEGMENTS.map((seg, i) => (
                <path
                  key={`t${i}`}
                  d={pathD(seg)}
                  pathLength={1}
                  className="draw-path"
                  stroke="rgb(var(--s-ember-400))"
                  strokeWidth={4}
                />
              ))}
            </g>
            <circle className="vista-beacon" cx={sx} cy={sy} r={34} fill="none" stroke="rgb(var(--s-ember-400))" strokeWidth={3} />
            <circle cx={sx} cy={sy} r={11} fill="rgb(var(--s-forest-950))" stroke="rgb(var(--s-ember-400))" strokeWidth={5} />
          </svg>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-transparent [background-size:100%_35%] bg-no-repeat" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-transparent to-forest-950" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
