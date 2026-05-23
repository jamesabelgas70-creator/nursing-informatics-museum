"use client";

import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { ecgLottie } from "@/data/ecgLottie";

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 3100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFE8CC 50%, #FFD9A8 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
          transition={{ duration: 0.9, ease: [0.22, 0.65, 0.28, 1] }}
        >
          <div className="noise-overlay absolute inset-0" />
          <motion.div
            className="absolute inset-0 bg-medical-grid bg-[length:60px_60px] opacity-10"
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2.2 }}
          />

          {/* Ceiling spotlight effect */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-70"
            style={{ background: "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(255,200,80,0.5) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 grid min-h-screen place-items-center px-6 text-center">
            <motion.div
              initial={{ y: 34, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="w-full max-w-4xl"
            >
              <div className="pointer-events-none absolute size-px opacity-0" aria-hidden="true">
                <Lottie animationData={ecgLottie} loop autoplay />
              </div>
              <div className="mx-auto mb-8 h-24 max-w-xl">
                <div className="ecg-line" />
              </div>
              <motion.p
                className="mb-4 text-sm font-semibold uppercase text-orange-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
              >
                BSN2A - NCM 110 Nursing Informatics
              </motion.p>
              <motion.h1
                className="text-balance text-5xl font-semibold leading-[1.02] text-stone-800 sm:text-7xl lg:text-8xl"
                initial={{ opacity: 0, filter: "blur(18px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.15, delay: 0.55 }}
              >
                Evolution of Nursing Informatics
              </motion.h1>
              <motion.p
                className="mx-auto mt-6 max-w-2xl text-lg text-stone-500 sm:text-xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                From Traditional Care to Smart Healthcare
              </motion.p>
            </motion.div>
          </div>

          {/* Sweep shimmer */}
          <motion.div
            className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent"
            animate={{ x: ["-100%", "220%"] }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
