"use client";

import { motion } from "framer-motion";

export default function EndingScene() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-24 text-center" style={{ background: "linear-gradient(180deg, #FFD9A8 0%, #FFCA80 100%)" }}>
      <div className="absolute inset-0 bg-medical-grid bg-[length:76px_76px] opacity-[0.06]" />
      <motion.div
        className="absolute inset-x-0 top-1/2 mx-auto max-w-4xl opacity-60"
        initial={{ opacity: 0.7 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 4.5, ease: "easeOut" }}
      >
        <div className="ecg-line" />
      </motion.div>
      <motion.div
        className="relative z-10 max-w-4xl"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1 }}
      >
        <p className="mb-5 text-sm font-semibold uppercase text-orange-500">End Scene</p>
        <h2 className="text-balance text-4xl font-semibold leading-tight text-stone-800 sm:text-6xl">
          Healthcare continues to evolve through innovation and technology.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-stone-500">
          From traditional care to smart healthcare, nursing informatics keeps the
          human heartbeat inside every digital system.
        </p>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-amber-200/60 to-transparent" />
    </section>
  );
}
