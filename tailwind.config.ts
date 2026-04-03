import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Cinematic palette
        void: "#080808",
        obsidian: "#0e0e0e",
        graphite: "#1a1a1a",
        ash: "#2a2a2a",
        smoke: "#3d3d3d",
        silver: "#8a8a8a",
        mist: "#c4c4c4",
        ivory: "#f0ede8",
        // Accent — deep amber/gold like film
        ember: {
          DEFAULT: "#d4840a",
          light: "#f0a830",
          dark: "#9a5f00",
          muted: "#d4840a22",
        },
        // Secondary accent — film red
        reel: {
          DEFAULT: "#c0392b",
          light: "#e74c3c",
          muted: "#c0392b22",
        },
      },
      backgroundImage: {
        "grain": "url('/grain.png')",
        "vignette": "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.9) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-right": "slideRight 0.5s ease forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "film-strip": "filmStrip 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,132,10,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212,132,10,0.5)" },
        },
        filmStrip: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "cinema": "0 25px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)",
        "card": "0 4px 24px rgba(0,0,0,0.5)",
        "glow-amber": "0 0 30px rgba(212,132,10,0.3)",
        "glow-red": "0 0 30px rgba(192,57,43,0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
