import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  title: string;
  /** One short supporting line under the headline. */
  children?: ReactNode;
  className?: string;
}

/** Poster-scale section headline that rises out of a mask as it enters view. */
export function SectionHeading({ id, title, children, className = "" }: SectionHeadingProps) {
  return (
    <header className={className}>
      <h2 id={id} className="s-display text-[clamp(3.25rem,9vw,8rem)]">
        <span data-reveal="mask" className="block overflow-hidden pb-[0.03em]">
          <span className="block">{title}</span>
        </span>
      </h2>
      {children ? (
        <p data-reveal className="mt-5 max-w-[46ch] text-lg leading-relaxed text-sage" style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
          {children}
        </p>
      ) : null}
    </header>
  );
}
