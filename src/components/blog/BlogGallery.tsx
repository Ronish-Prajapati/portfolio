"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface BlogGalleryProps {
  images: string[];
  title?: string;
}

export default function BlogGallery({ images, title }: BlogGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, prev, next]);

  if (images.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
        <Camera className="w-6 h-6 text-accent" />
        {title ?? "Photo Gallery"}
      </h2>

      {/* Masonry-style columns */}
      <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            onClick={() => setIndex(i)}
            className="group block w-full overflow-hidden rounded-xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent break-inside-avoid"
            aria-label={`Open image ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title ?? "Gallery"} photo ${i + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={index !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background/95 border-border">
          {index !== null && (
            <div className="relative flex items-center justify-center bg-black min-h-[50vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[index]}
                alt={`${title ?? "Gallery"} photo ${index + 1}`}
                className="max-h-[82vh] w-auto object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-black hover:bg-white transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-black hover:bg-white transition"
                    aria-label="Next image"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-mono">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
