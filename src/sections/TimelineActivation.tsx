"use client";

import { motion } from "framer-motion";
import { ArrowDown, Zap } from "lucide-react";
import { decades } from "@/data/site";

export default function TimelineActivation() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-16" style={{ background: "linear-gradient(180deg, #FFE8CC 0%, #FFD9A8 100%)" }}>
      <div className="absolute inset-0 bg-medical-grid bg-[length:58px_58px] opacity-[0.07]" />
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="mx-auto mb-8 grid size-16 place-items-center rounded-full border border-orange-300 bg-orange-100 text-orange-500 shadow-[0_0_28px_rgba(234,88,12,0.25)]" data-reveal>
          <Zap size={24} />
        </div>
        <h2 className="text-balance text-4xl font-semibold text-stone-800 sm:text-6xl" data-reveal>
          Timeline Activated
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-500" data-reveal>
          The archive line opens from early healthcare computing to mobile health,
          AI, cloud records, and predictive care.
        </p>
        <div className="relative mx-auto mt-14 h-32 max-w-5xl">
          <motion.div
            className="absolute left-0 top-1/2 h-1 w-full rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 1.4, ease: [0.22, 0.65, 0.28, 1] }}
          />
          <div className="relative flex h-full items-center justify-between">
            {decades.map((item, index) => (
              <motion.button
                type="button"
                key={item.decade}
                onClick={() => document.getElementById(item.decade)?.scrollIntoView({ behavior: "smooth" })}
                className="grid size-16 place-items-center rounded-full border border-orange-200 bg-white/90 text-sm font-bold text-stone-700 shadow-md backdrop-blur-sm transition hover:border-orange-400 hover:text-orange-600"
                initial={{ opacity: 0, y: 20, scale: 0.7 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: index * 0.1, duration: 0.55 }}
              >
                {item.decade}
              </motion.button>
            ))}
          </div>
        </div>
        <ArrowDown className="mx-auto mt-6 animate-bounce text-orange-400" size={24} />
      </div>
    </section>
  );
}
