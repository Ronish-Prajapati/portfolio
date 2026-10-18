import type { CSSProperties } from "react";
import Image from "next/image";
import type { Testimonial } from "@prisma/client";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

function Person({ t }: { t: Testimonial }) {
  return (
    <figcaption className="flex items-center gap-4">
      {t.image ? (
        <Image src={t.image} alt="" width={52} height={52} className="h-[52px] w-[52px] rounded-full border border-snow/15 object-cover grayscale-[0.2]" />
      ) : (
        <span aria-hidden className="grid h-[52px] w-[52px] place-items-center rounded-full border border-snow/15 font-display text-lg text-ember">
          {t.name.charAt(0)}
        </span>
      )}
      <span>
        <span className="block font-medium text-snow">{t.name}</span>
        <span className="block text-sm text-sage">{t.role}</span>
      </span>
    </figcaption>
  );
}

/** Words from people Ronish has worked with, quoted exactly as stored in the CMS. */
const Testimonials = ({ testimonials }: TestimonialsProps) => {
  if (testimonials.length === 0) return null;
  const [lead, ...rest] = testimonials;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[60%] -translate-y-1/2 bg-[url(/landscape/mist.webp)] bg-[length:1600px_100%] bg-repeat-x opacity-[0.04]"
      />
      <div className="s-container relative">
        <h2 id="testimonials-title" data-reveal className="s-label">
          What colleagues say
        </h2>

        <figure className="mt-10 max-w-5xl">
          <blockquote data-reveal style={delay(0.08)}>
            <p className="text-balance text-[clamp(1.8rem,3.8vw,3.4rem)] font-medium leading-[1.18] tracking-[-0.015em] text-snow">
              <span aria-hidden className="mr-1 text-ember">
                &ldquo;
              </span>
              {lead.message}
              <span aria-hidden className="text-ember">
                &rdquo;
              </span>
            </p>
          </blockquote>
          <div data-reveal style={delay(0.16)} className="mt-10">
            <Person t={lead} />
          </div>
        </figure>

        {rest.length > 0 ? (
          <ul className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {rest.map((t, i) => (
              <li key={t.id} data-reveal style={delay(0.06 * i)}>
                <figure className="border-t border-snow/10 pt-8">
                  <blockquote>
                    <p className="text-xl leading-relaxed text-fog">&ldquo;{t.message}&rdquo;</p>
                  </blockquote>
                  <div className="mt-6">
                    <Person t={t} />
                  </div>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
};

export default Testimonials;
