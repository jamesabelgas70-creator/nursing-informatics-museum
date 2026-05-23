"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { pioneers, type Pioneer } from "@/data/site";

function PioneerBust({ pioneer }: { pioneer: Pioneer }) {
  const ringColor =
    pioneer.accent === "gold" ? "rgba(217,119,6,0.7)"
    : pioneer.accent === "candle" ? "rgba(255,180,50,0.7)"
    : pioneer.accent === "mint" ? "rgba(255,140,0,0.7)"
    : "rgba(234,88,12,0.7)";

  const textColor =
    pioneer.accent === "gold" ? "text-amber-600"
    : pioneer.accent === "candle" ? "text-yellow-600"
    : pioneer.accent === "mint" ? "text-orange-500"
    : "text-orange-600";

  const initials = pioneer.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("");

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative mb-4"
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${ringColor}` }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${ringColor}` }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <div
          className={`relative grid size-28 place-items-center overflow-hidden rounded-full border-2 bg-white text-3xl font-bold ${textColor}`}
          style={{ borderColor: ringColor, boxShadow: `0 0 24px ${ringColor}` }}
        >
          {pioneer.image ? (
            <img
              src={pioneer.image.src}
              alt={pioneer.image.alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="relative z-10">{initials}</span>
          )}
        </div>
      </motion.div>

      {/* Brass nameplate */}
      <div className="rounded-sm border border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50 px-4 py-2 text-center shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">{pioneer.name}</p>
        <p className="mt-0.5 text-[9px] uppercase tracking-widest text-stone-400">{pioneer.years}</p>
      </div>
    </div>
  );
}

function PedestalCard({ pioneer, onClick }: { pioneer: Pioneer; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col items-center text-center outline-none"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      whileHover={{ scale: 1.02 }}
    >
      <PioneerBust pioneer={pioneer} />

      <div className="pedestal-base mt-4 w-full rounded-t-sm px-5 py-5">
        <p className="text-sm font-semibold leading-snug text-stone-800">{pioneer.title}</p>
        <p className="mt-3 text-xs leading-5 text-stone-500">{pioneer.summary}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-1">
          {pioneer.effects.slice(0, 2).map((e) => (
            <span key={e} className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] text-orange-600">
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="pedestal-step w-[90%] rounded-b-sm py-2 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600">View Exhibit</p>
      </div>
    </motion.button>
  );
}

export default function PioneerHall() {
  const [selected, setSelected] = useState<Pioneer | null>(null);

  return (
    <section id="pioneers" className="relative overflow-hidden px-5 py-28 sm:px-8 lg:px-16" style={{ background: "linear-gradient(180deg, #FFF3E0 0%, #FFE8CC 100%)" }}>
      <div className="absolute inset-0 bg-medical-grid bg-[length:74px_74px] opacity-[0.06]" />

      {/* Ceiling spotlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,200,80,0.35) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
            Museum Wing — Hall of Legends
          </p>
          <h2 className="text-balance text-4xl font-semibold text-stone-800 sm:text-6xl">Hall of Pioneers</h2>
          <div className="mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-500">
            Nursing informatics began with disciplined observation, standardized data,
            clinical systems, and the people who made nursing knowledge computable.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {pioneers.map((pioneer) => (
            <PedestalCard key={pioneer.id} pioneer={pioneer} onClick={() => setSelected(pioneer)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[72] grid place-items-center p-4 backdrop-blur-xl"
            style={{ background: "rgba(255,243,224,0.88)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-[0_8px_60px_rgba(234,88,12,0.18)]"
              initial={{ y: 28, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 18, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50 px-7 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600">
                    Exhibit Info — Pioneer Archive
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelected(null)}
                  className="grid size-8 place-items-center rounded-full border border-orange-200 bg-white text-stone-500 transition hover:border-orange-400 hover:text-orange-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-7 p-7 sm:grid-cols-[220px_1fr] sm:p-9">
                <div className="mx-auto w-full max-w-[220px]">
                  <div className="overflow-hidden rounded-lg border border-orange-200 bg-orange-50 shadow-[0_18px_44px_rgba(120,70,20,0.16)]">
                    {selected.image ? (
                      <img
                        src={selected.image.src}
                        alt={selected.image.alt}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <div className="grid aspect-[4/5] place-items-center text-4xl font-bold text-orange-500">
                        {selected.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("")}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
                    Pioneer Portrait
                  </p>
                </div>

                <div>
                <p className="mb-2 text-sm text-orange-500">{selected.title}</p>
                <h3 className="text-3xl font-semibold text-stone-800 sm:text-4xl">{selected.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-widest text-stone-400">{selected.years}</p>
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
                <p className="leading-7 text-stone-600">{selected.summary}</p>

                <div className="mt-6 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Exhibit Notes</p>
                  {selected.details.map((detail, i) => (
                    <div key={detail} className="flex gap-4 rounded-lg border border-orange-100 bg-orange-50/60 p-4">
                      <span className="mt-0.5 shrink-0 text-xs font-bold text-orange-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-6 text-stone-600">{detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.effects.map((effect) => (
                    <span key={effect} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-600">
                      {effect}
                    </span>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
