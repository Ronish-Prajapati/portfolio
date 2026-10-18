"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GalleryImage } from "@prisma/client";

interface GalleryProps {
  images: GalleryImage[];
}

/** Photo strip from the CMS gallery, with a lightbox. Renders nothing when empty. */
const Gallery = ({ images }: GalleryProps) => {
  const [active, setActive] = useState<GalleryImage | null>(null);

  if (images.length === 0) return null;

  return (
    <div id="gallery" className="mt-28 scroll-mt-24 md:mt-36">
      <div className="s-container flex items-end justify-between gap-6">
        <h3 className="s-title text-[clamp(1.6rem,2.6vw,2.25rem)]">Gallery</h3>
        <p className="s-label hidden sm:block">{images.length} photos</p>
      </div>
      <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--s-gutter)] pb-4 [scrollbar-width:thin]">
        {images.map((img) => (
          <li key={img.id} className="shrink-0 snap-start">
            <button
              type="button"
              onClick={() => setActive(img)}
              className="group relative block h-[min(60vh,26rem)] w-[min(78vw,22rem)] overflow-hidden rounded-[2px] border border-snow/10 bg-forest-900"
              aria-label={`Open photo${img.title ? `: ${img.title}` : ""}`}
            >
              <Image
                src={img.image}
                alt={img.title ?? img.caption ?? "Gallery photo"}
                fill
                sizes="(max-width: 640px) 78vw, 22rem"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {img.title || img.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/90 to-transparent p-4 text-left text-sm text-snow opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {img.title ?? img.caption}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl overflow-hidden border-snow/10 bg-forest-950 p-0">
          <DialogTitle className="sr-only">{active?.title ?? "Gallery photo"}</DialogTitle>
          {active ? (
            <div>
              <div className="relative flex max-h-[80vh] w-full items-center justify-center bg-night">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.image} alt={active.title ?? "Gallery photo"} className="max-h-[80vh] w-auto object-contain" />
              </div>
              {active.title || active.caption ? (
                <div className="p-5">
                  {active.title ? <p className="font-medium text-snow">{active.title}</p> : null}
                  {active.caption ? <p className="mt-1 text-sm text-sage">{active.caption}</p> : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
