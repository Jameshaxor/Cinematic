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
        void: "#050507",
        obsidian: "#0c0c10",
        graphite: "#13131a",
        ash: "#1e1e28",
        smoke: "#2e2e3d",
        muted: "#52526e",
        silver: "#9090b0",
        mist: "#c8c8e0",
        ivory: "#eeeef8",
        // Primary — deep violet
        violet: {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
          bright: "#8b5cf6",
          dark: "#5b21b6",
          muted: "rgba(124,58,237,0.12)",
          glow: "rgba(124,58,237,0.35)",
        },
        // Secondary — electric indigo
        indigo: {
          DEFAULT: "#4f46e5",
          light: "#818cf8",
          muted: "rgba(79,70,229,0.12)",
        },
        // Accent — rose for ratings/alerts
        rose: {
          DEFAULT: "#e11d48",
          light: "#fb7185",
          muted: "rgba(225,29,72,0.12)",
        },
      },
      backgroundImage: {
        "purple-mesh": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)",
      },
      boxShadow: {
        "cinema": "0 32px 80px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.6)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "glow-violet": "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15)",
        "glow-sm": "0 0 20px rgba(124,58,237,0.25)",
        "inner-violet": "inset 0 1px 0 rgba(167,139,250,0.1)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-violet": "pulseViolet 3s ease-in-out infinite",
        "border-flow": "borderFlow 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseViolet: {
          "0%,100%": { boxShadow: "0 0 20px rgba(124,58,237,0.2)" },
          "50%": { boxShadow: "0 0 50px rgba(124,58,237,0.5)" },
        },
        borderFlow: {
          "0%,100%": { borderColor: "rgba(124,58,237,0.3)" },
          "50%": { borderColor: "rgba(124,58,237,0.8)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
