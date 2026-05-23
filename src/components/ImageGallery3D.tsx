"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useState } from "react";
import type { ExhibitImage } from "@/data/assets";

type ImageGallery3DProps = {
  images: ExhibitImage[];
  title: string;
  fallbackItems?: string[];
};

export default function ImageGallery3D({ images, title, fallbackItems = [] }: ImageGallery3DProps) {
  const [selected, setSelected] = useState<ExhibitImage | null>(null);

  return (
    <>
      <div className="relative min-h-[360px] w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-4 [perspective:1100px]">
        <div className="absolute inset-0 bg-medical-grid bg-[length:48px_48px] opacity-25" />
        {images.length > 0 ? (
          <div className="relative grid h-full grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((image, index) => (
            <motion.button
              type="button"
              key={`${image.src}-${index}`}
              onClick={() => setSelected(image)}
              className="group relative min-h-[150px] overflow-hidden rounded-md border border-white/12 bg-night/60 text-left shadow-glass outline-none transition hover:z-10 hover:border-mintPulse/60 focus-visible:border-mintPulse/80"
              initial={{ opacity: 0, rotateY: -18, y: 28 }}
              whileInView={{ opacity: 1, rotateY: index % 2 ? -4 : 4, y: index % 2 ? 14 : 0 }}
              whileHover={{ rotateY: 0, rotateX: 0, scale: 1.045, y: -8 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover grayscale-[18%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs text-mintPulse">
                  <Maximize2 size={14} />
                  <span>{title}</span>
                </div>
                <p className="text-sm leading-snug text-surgical/88">{image.caption}</p>
              </div>
            </motion.button>
            ))}
          </div>
        ) : (
          <div className="relative grid min-h-[320px] gap-4 md:grid-cols-3">
            {(fallbackItems.length ? fallbackItems.slice(0, 3) : [title]).map((item, index) => (
              <motion.div
                key={`${title}-${item}`}
                className="group relative overflow-hidden rounded-md border border-cyanGlow/18 bg-night/70 p-5 shadow-glass"
                initial={{ opacity: 0, rotateY: -18, y: 28 }}
                whileInView={{ opacity: 1, rotateY: index % 2 ? -5 : 5, y: index % 2 ? 14 : 0 }}
                whileHover={{ rotateY: 0, scale: 1.035, y: -8 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,170,51,0.24),transparent_42%),linear-gradient(180deg,rgba(255,209,102,0.10),transparent)]" />
                <div className="scan-lines absolute inset-0 opacity-35" />
                <div className="relative flex h-full min-h-[220px] flex-col justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase text-mintPulse/75">{title}</p>
                    <h3 className="mt-5 text-2xl font-semibold leading-tight text-white">{item}</h3>
                  </div>
                  <div className="mt-8 h-24 rounded-md border border-white/10 bg-medical-grid bg-[length:22px_22px] opacity-80" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/86 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="glass-panel relative w-full max-w-5xl overflow-hidden rounded-lg p-3"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close image preview"
                onClick={() => setSelected(null)}
                className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-ink/70 text-white transition hover:border-mintPulse/60 hover:text-mintPulse"
              >
                <X size={18} />
              </button>
              <img
                src={selected.src}
                alt={selected.alt}
                className="max-h-[72vh] w-full rounded-md object-contain"
              />
              <p className="px-2 pb-2 pt-4 text-sm text-surgical/82">{selected.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
