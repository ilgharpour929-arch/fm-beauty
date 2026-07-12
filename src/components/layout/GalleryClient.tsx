"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/Lightbox";

interface GalleryImage {
  src: string;
  alt: string;
}

export function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-2xl overflow-hidden group glass-card-borderless cursor-pointer"
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              quality={90}
              className="object-cover group-hover:scale-[1.08] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-text-primary text-sm font-medium">{img.alt}</span>
            </div>
            <div className="absolute inset-0 ring-1 ring-accent-500/0 group-hover:ring-accent-500/30 rounded-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          src={images[lightboxIndex].src}
          alt={images[lightboxIndex].alt}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}