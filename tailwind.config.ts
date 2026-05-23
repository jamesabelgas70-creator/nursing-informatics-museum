import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#FFF8EE",
        night: "#FFF3E0",
        surgical: "#2C1A00",
        cyanGlow: "#EA580C",
        mintPulse: "#FF8C00",
        silverGlass: "#F5CFA0",
        pioneerGold: "#D97706",
        museumWall: "#FFF8EE",
        museumFloor: "#F5ECD7",
        museumAccent: "#EA580C",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(180, 80, 0, 0.12)",
        gold: "0 0 44px rgba(234, 88, 12, 0.30)",
      },
      backgroundImage: {
        "medical-grid":
          "linear-gradient(rgba(234, 88, 12, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 140, 0, 0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
