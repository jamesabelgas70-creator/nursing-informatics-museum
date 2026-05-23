"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Database, ShieldCheck } from "lucide-react";
import ParticleField from "@/components/ParticleField";
import { fadeUp, staggerContainer } from "@/animations/sectionMotion";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-medical-grid bg-[length:64px_64px] opacity-20" />,
});

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFF0D6 50%, #FFE4B5 100%)" }}>
      <Scene3D variant="hero" />
      <ParticleField density={62} />

      {/* Warm ceiling spotlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-60"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,209,102,0.45) 0%, rgba(255,140,0,0.18) 42%, transparent 72%)" }}
      />
      {/* Subtle warm vignette sides */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(255,220,160,0.18) 0%, transparent 20%, transparent 80%, rgba(255,220,160,0.18) 100%)" }} />

      <motion.div
        className="relative z-10 flex min-h-screen items-center px-5 py-28 sm:px-8 lg:px-16"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl">
          <motion.p variants={fadeUp} className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Futuristic Medical Digital Museum
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-balance max-w-5xl text-5xl font-semibold leading-[1.02] text-stone-800 sm:text-7xl lg:text-8xl"
          >
            Step Inside the Museum of Nursing Informatics
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl"
          >
            A gallery walk through the decades that shaped modern healthcare technology.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-gallery"))}
              className="group inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 text-sm font-bold text-white shadow-[0_4px_28px_rgba(234,88,12,0.40)] transition hover:scale-[1.03] hover:bg-orange-400"
            >
              Enter the Gallery
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <Activity size={18} className="text-orange-400" />
              <span>BSN2A — NCM 110 Nursing Informatics</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 right-5 z-10 hidden max-w-sm gap-3 lg:right-16 xl:grid">
        {[
          ["Data", "Organized clinical information", Database],
          ["Safety", "Technology-guided decisions", ShieldCheck],
          ["Care", "Human judgment amplified", Activity],
        ].map(([label, copy, Icon], index) => (
          <motion.div
            key={label as string}
            className="rounded-xl border border-orange-200 bg-white/80 p-4 shadow-md backdrop-blur-md"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.09, duration: 0.75 }}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-stone-800">{label as string}</p>
                <p className="text-xs text-stone-500">{copy as string}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
