"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Cross, Orbit, ScanHeart } from "lucide-react";
import { futureSignals } from "@/data/site";

export default function FutureSection() {
  return (
    <section id="future" className="relative min-h-screen overflow-hidden px-5 py-28 sm:px-8 lg:px-16" style={{ background: "linear-gradient(180deg, #FFE8CC 0%, #FFD9A8 100%)" }}>
      <div className="absolute inset-0 bg-medical-grid bg-[length:72px_72px] opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-50"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,200,80,0.4) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-4xl" data-reveal>
          <p className="mb-4 text-sm font-semibold uppercase text-orange-500">Future of Nursing Informatics</p>
          <h2 className="text-balance text-5xl font-semibold leading-[1.04] text-stone-800 sm:text-7xl">
            Smart care, predictive systems, and nurses at the center of the signal.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-500">
            The next era connects artificial intelligence, digital twins, robotics,
            immersive training, and clinical judgment into safer health ecosystems.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {futureSignals.map((signal, index) => {
            const icons = [BrainCircuit, Cross, Orbit, ScanHeart];
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={signal}
                className="group rounded-2xl border border-orange-200 bg-white/80 p-6 shadow-md backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.06, duration: 0.7 }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-xl border border-orange-200 bg-orange-50 text-orange-500 transition group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-sm text-amber-500/70">0{index + 1}</span>
                </div>
                <h3 className="text-2xl font-semibold text-stone-800">{signal}</h3>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-orange-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${72 + index * 4}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
