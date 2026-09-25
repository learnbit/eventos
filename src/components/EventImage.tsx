"use client";

import Image from "next/image";
import { useState } from "react";

type EventImageProps = {
  src: string;
  alt: string;
};

export default function EventImage({ src, alt }: EventImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface cursor-pointer"
        aria-label="Ampliar imagen"
        onClick={() => setOpen(true)}
      >
        <Image className="object-contain" src={src} alt={alt} fill />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
          <div
            className="relative h-[90vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-10 h-10 flex w-10 cursor-pointer items-center justify-center rounded-full border-white/20 bg-white/15 text-xl text-white transition-colors backdrop-blur-sm hover:bg-white/25"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <Image
              className="object-contain"
              src={src}
              alt={alt}
              sizes="90vw"
              fill
            />
          </div>
        </div>
      )}
    </>
  );
}
