"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/utils/cn";

type HologramCardProps = {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "mint" | "gold" | "candle";
  onClick?: () => void;
};

const glowStyles = {
  cyan: "hover:border-cyanGlow/60 hover:shadow-[0_0_42px_rgba(255,170,51,0.26)]",
  mint: "hover:border-mintPulse/60 hover:shadow-[0_0_42px_rgba(255,209,102,0.24)]",
  gold: "hover:border-pioneerGold/70 hover:shadow-gold",
  candle: "hover:border-amber-300/70 hover:shadow-[0_0_42px_rgba(245,158,11,0.24)]"
};

export default function HologramCard({
  children,
  className,
  glow = "cyan",
  onClick
}: HologramCardProps) {
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter") onClick?.();
      }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTransform(`rotateX(${y * -8}deg) rotateY(${x * 10}deg)`);
      }}
      onPointerLeave={() => setTransform("rotateX(0deg) rotateY(0deg)")}
      className={cn(
        "glass-panel hologram-frame group relative overflow-hidden rounded-lg p-5 transition duration-300 will-change-transform",
        glowStyles[glow],
        onClick && "cursor-pointer",
        className
      )}
      style={{ transform }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyanGlow/70 to-transparent" />
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="scan-lines absolute inset-0" />
      </div>
      {children}
    </article>
  );
}
