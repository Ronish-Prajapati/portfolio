"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { GalleryImage } from "@prisma/client";

interface GalleryProps {
  images: GalleryImage[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [active, setActive] = useState<GalleryImage | null>(null);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">Captured Moments</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Gallery</h2>
          <p className="text-muted-foreground">
            A visual collection of moments, work and inspiration.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setActive(img)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={img.title ?? "View image"}
            >
              <Image
                src={img.image}
                alt={img.title ?? "Gallery image"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={index < 4}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                {(img.title || img.caption) && (
                  <div className="text-left">
                    {img.title && (
                      <p className="text-white font-semibold text-sm">{img.title}</p>
                    )}
                    {img.caption && (
                      <p className="text-white/80 text-xs line-clamp-2">{img.caption}</p>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
          {active && (
            <div>
              <div className="relative w-full max-h-[80vh] flex items-center justify-center bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={active.title ?? "Gallery image"}
                  className="max-h-[80vh] w-auto object-contain"
                />
              </div>
              {(active.title || active.caption) && (
                <div className="p-5">
                  {active.title && (
                    <h3 className="font-semibold text-foreground">{active.title}</h3>
                  )}
                  {active.caption && (
                    <p className="text-muted-foreground text-sm mt-1">{active.caption}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;
