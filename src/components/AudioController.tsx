"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioController() {
  const [active, setActive] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  const start = () => {
    const context = new AudioContext();
    const master = context.createGain();
    const low = context.createOscillator();
    const shimmer = context.createOscillator();
    const heartbeat = context.createOscillator();
    const beatGain = context.createGain();

    master.gain.value = 0.026;
    low.type = "sine";
    shimmer.type = "triangle";
    heartbeat.type = "sine";
    low.frequency.value = 64;
    shimmer.frequency.value = 256;
    heartbeat.frequency.value = 38;
    beatGain.gain.value = 0;

    low.connect(master);
    shimmer.connect(master);
    heartbeat.connect(beatGain);
    beatGain.connect(master);
    master.connect(context.destination);

    const beat = window.setInterval(() => {
      const now = context.currentTime;
      beatGain.gain.cancelScheduledValues(now);
      beatGain.gain.setValueAtTime(0, now);
      beatGain.gain.linearRampToValueAtTime(0.18, now + 0.025);
      beatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    }, 1420);

    low.start();
    shimmer.start();
    heartbeat.start();

    audioContext.current = context;
    cleanup.current = () => {
      window.clearInterval(beat);
      low.stop();
      shimmer.stop();
      heartbeat.stop();
      context.close();
    };
  };

  const toggle = () => {
    if (active) {
      cleanup.current?.();
      cleanup.current = null;
      audioContext.current = null;
      setActive(false);
      return;
    }

    start();
    setActive(true);
  };

  return (
    <button
      type="button"
      aria-label={active ? "Mute ambient sound" : "Play ambient sound"}
      onClick={toggle}
      className="fixed right-5 top-5 z-50 grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-surgical shadow-glass backdrop-blur-xl transition hover:border-mintPulse/50 hover:text-mintPulse"
    >
      {active ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
