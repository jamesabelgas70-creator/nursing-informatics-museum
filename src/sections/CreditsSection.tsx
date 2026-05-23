"use client";

import { motion } from "framer-motion";
import { GraduationCap, UsersRound } from "lucide-react";
import { students } from "@/data/site";

export default function CreditsSection() {
  return (
    <section id="credits" className="relative overflow-hidden px-5 py-28 sm:px-8 lg:px-16" style={{ background: "linear-gradient(180deg, #FFF3E0 0%, #FFE8CC 100%)" }}>
      <div className="absolute inset-0 bg-medical-grid bg-[length:70px_70px] opacity-[0.06]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div data-reveal>
          <div className="mb-6 grid size-14 place-items-center rounded-xl border border-orange-200 bg-orange-50 text-orange-500">
            <GraduationCap size={25} />
          </div>
          <p className="mb-4 text-sm font-semibold uppercase text-orange-500">Class Presentation</p>
          <h2 className="text-balance text-4xl font-semibold text-stone-800 sm:text-6xl">
            BSN2A - NCM 110 Nursing Informatics
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-500">
            A digital exhibit prepared as a cinematic learning experience for the
            evolution of nursing informatics.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-[520px] overflow-hidden rounded-2xl border border-orange-200 bg-white/80 p-5 shadow-md" data-reveal>
            <div className="mb-5 flex items-center gap-3 text-orange-500">
              <UsersRound size={19} />
              <span className="text-sm font-semibold text-stone-700">BSN2A Credits</span>
            </div>
            <div className="cinematic-mask relative h-[440px] overflow-hidden">
              <motion.div
                className="space-y-3"
                animate={{
                  y: ["-0%", "-50%"]
                }}
                transition={{
                  duration: 45,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {[...students, ...students].map((student, index) => (
                  <p key={`${student}-${index}`} className="text-lg text-stone-600">{student}</p>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="grid content-start gap-5">
            <motion.div
              className="rounded-2xl border border-orange-200 bg-white/80 p-6 shadow-md"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-stone-800">Course Information</h3>
              <div className="space-y-3 text-sm text-stone-600">
                <div>
                  <p className="font-semibold text-orange-600">Course Code</p>
                  <p>NCM 110</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Course Title</p>
                  <p>Nursing Informatics</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Section</p>
                  <p>BSN2A</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Total Students</p>
                  <p>37 Students</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-orange-200 bg-white/80 p-6 shadow-md"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-stone-800">Project Details</h3>
              <div className="space-y-3 text-sm text-stone-600">
                <div>
                  <p className="font-semibold text-orange-600">Project Type</p>
                  <p>Digital Museum Exhibition</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Theme</p>
                  <p>Evolution of Nursing Informatics</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Timeline Coverage</p>
                  <p>1950s - 2010s</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-600">Format</p>
                  <p>Interactive 3D Gallery Experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-orange-200 bg-white/80 p-6 shadow-md"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-stone-800">Acknowledgments</h3>
              <p className="text-sm leading-relaxed text-stone-600">
                This digital exhibit was created as a collaborative class project to showcase the rich history and evolution of nursing informatics from early computer use in healthcare to modern AI-assisted care systems.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
