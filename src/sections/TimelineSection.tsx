"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/animations/sectionMotion";
import type { Decade } from "@/data/site";

type TimelineSectionProps = { decade: Decade };

function MuseumFrame({ src, alt, caption, index }: { src: string; alt: string; caption: string; index: number }) {
  const [tilt, setTilt] = useState("rotateX(0deg) rotateY(0deg)");
  const [bright, setBright] = useState(false);

  return (
    <motion.div
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      {/* Spotlight beam */}
      <div
        className="pointer-events-none absolute -top-10 left-1/2 h-40 w-32 -translate-x-1/2 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${bright ? "rgba(255,160,50,0.5)" : "rgba(255,200,100,0.15)"} 0%, transparent 72%)`,
        }}
      />

      {/* Frame */}
      <div
        role="button"
        tabIndex={0}
        className="museum-frame relative cursor-pointer overflow-hidden rounded-sm border-4 border-amber-400/70 bg-white shadow-[0_8px_32px_rgba(180,80,0,0.15)] transition-all duration-300"
        style={{
          transform: tilt,
          transformStyle: "preserve-3d",
          perspective: "900px",
          boxShadow: bright
            ? "0 0 28px rgba(234,88,12,0.4), 0 8px 32px rgba(180,80,0,0.2)"
            : "0 8px 32px rgba(180,80,0,0.15)",
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          setTilt(`rotateX(${y * -10}deg) rotateY(${x * 12}deg)`);
          setBright(true);
        }}
        onMouseLeave={() => { setTilt("rotateX(0deg) rotateY(0deg)"); setBright(false); }}
        onKeyDown={() => {}}
      >
        <div className="relative h-48 w-full sm:h-56">
          <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Brass placard */}
      <div className="museum-placard mt-3 max-w-[180px] rounded-sm border border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50 px-3 py-2 text-center shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-700 leading-snug">{caption}</p>
      </div>
    </motion.div>
  );
}

export default function TimelineSection({ decade }: TimelineSectionProps) {
  const isGold = !!(decade.majorEvent || decade.decade === "1980s");

  return (
    <section
      id={decade.decade}
      data-decade={decade.decade}
      className="exhibit-room relative overflow-hidden px-5 py-20 sm:px-8 lg:px-16"
      style={{ background: isGold ? "linear-gradient(180deg, #FFF8EE 0%, #FFF3E0 100%)" : "linear-gradient(180deg, #FFF3E0 0%, #FFE8CC 100%)" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {decade.images[0] && (
          <img src={decade.images[0].src} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-[0.06]" />
        )}
        <div className="absolute inset-0 bg-medical-grid bg-[length:68px_68px] opacity-[0.06]" />
        <div className="noise-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Entrance arch */}
        <motion.div
          className="mb-14 flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={fadeUp}
            className="relative flex flex-col items-center rounded-t-full border-x border-t border-orange-300/60 bg-white/70 px-12 pb-6 pt-8 backdrop-blur-sm shadow-sm"
            style={{ minWidth: 260 }}
          >
            {isGold && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-amber-400 bg-amber-50 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 shadow-[0_0_14px_rgba(217,119,6,0.3)]">
                ★ Featured Exhibit
              </div>
            )}
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-2">Gallery Room</p>
            <span className="rounded-full border border-orange-300 bg-orange-50 px-6 py-2 text-3xl font-bold tracking-tight text-stone-800">
              {decade.decade}
            </span>
            <p className="mt-3 text-sm text-stone-400 uppercase tracking-widest">Exhibit Hall</p>
          </motion.div>
          <div className="flex w-full max-w-xs justify-between">
            <div className="h-6 w-px bg-orange-300/40" />
            <div className="h-6 w-px bg-orange-300/40" />
          </div>
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
        </motion.div>

        {/* Gallery photos */}
        {decade.images.length > 0 && (
          <motion.div
            className="mb-14 flex flex-wrap justify-center gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {decade.images.map((img, i) => (
              <MuseumFrame key={img.src} src={img.src} alt={img.alt} caption={img.caption} index={i} />
            ))}
          </motion.div>
        )}

        {/* Info panel */}
        <motion.div
          className="mx-auto max-w-4xl rounded-2xl border border-orange-200 bg-white/85 p-8 shadow-[0_8px_40px_rgba(180,80,0,0.10)] backdrop-blur-sm"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-orange-200/60" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">Exhibit Information</p>
            <div className="h-px flex-1 bg-orange-200/60" />
          </div>

          <h2 className="text-balance text-3xl font-semibold text-stone-800 sm:text-5xl">{decade.title}</h2>
          <p className="mt-5 text-lg leading-8 text-stone-600">{decade.narrative}</p>

          <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-500">Highlights</p>
              <ul className="space-y-2">
                {decade.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-500">Developments</p>
              <ul className="space-y-2">
                {decade.developments.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {decade.contributions && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-500">Key Contributions</p>
              <div className="flex flex-wrap gap-2">
                {decade.contributions.map((c) => (
                  <span key={c} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-600">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
