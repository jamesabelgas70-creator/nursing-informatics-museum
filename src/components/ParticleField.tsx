"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

type ParticleFieldProps = {
  density?: number;
};

export default function ParticleField({ density = 54 }: ParticleFieldProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 90,
      particles: {
        number: { value: density, density: { enable: true, area: 900 } },
        color: { value: ["#FF8C00", "#FFD166", "#FFF8EE"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.14, max: 0.42 } },
        size: { value: { min: 0.6, max: 2.3 } },
        links: {
          enable: true,
          distance: 126,
          opacity: 0.14,
          color: "#FFAA33",
          width: 1
        },
        move: {
          enable: true,
          speed: 0.36,
          direction: "none" as const,
          outModes: { default: "out" as const }
        }
      },
      detectRetina: true,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" }
        },
        modes: {
          grab: { distance: 148, links: { opacity: 0.32 } }
        }
      }
    }),
    [density]
  );

  if (!ready) return null;

  return (
    <Particles
      id="museum-particles"
      className="absolute inset-0 z-0"
      options={options}
    />
  );
}
