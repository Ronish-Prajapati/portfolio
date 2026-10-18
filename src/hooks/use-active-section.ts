"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section currently crosses the middle of the viewport.
 * Uses IntersectionObserver (no scroll listeners), so it stays correct when
 * jumping to an anchor, scrolling quickly or resizing.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // Last section (in page order) touching the middle band wins.
        const current = elements.filter((el) => visible.get(el.id)).pop();
        setActive(current ? current.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
