"use client";

import { useRef, type ReactNode } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from "motion/react";

interface ParallaxFrameProps {
  children: ReactNode;
  className?: string;
  /** Total drift in % of the frame height across the scroll. Kept small on purpose. */
  amount?: number;
}

/**
 * Image frame whose content drifts slightly slower than the page, giving
 * screenshots and photos a sense of depth. Static under reduced motion.
 */
export default function ParallaxFrame({ children, className = "", amount = 5 }: ParallaxFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        <m.div className="absolute inset-x-0 -inset-y-[7%]" style={reduce ? undefined : { y }}>
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
}
