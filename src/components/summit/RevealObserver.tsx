"use client";

import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * One observer for every `[data-reveal]` element on the page.
 *
 * Content is fully visible in the server HTML. On hydration, anything already
 * on screen is marked revealed immediately (no flash), then the reveal styles
 * switch on for the rest, which animate in as they enter the viewport. Without
 * JavaScript nothing is ever hidden.
 */
export default function RevealObserver() {
  useIsomorphicLayoutEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const viewport = window.innerHeight;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewport && rect.bottom > 0) el.dataset.revealed = "";
    }
    document.documentElement.dataset.revealReady = "";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    elements.forEach((el) => {
      if (!("revealed" in el.dataset)) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.revealReady;
    };
  }, []);

  return null;
}
