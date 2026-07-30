import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#080808",
          soft: "#2b2b2b",
          muted: "#8B8276",
        },
        canvas: {
          DEFAULT: "#F7F4EF",
          raised: "#ffffff",
          sunk: "#F2F0EB",
        },
        gold: {
          DEFAULT: "#CBA96A",
          soft: "#D4BC8A",
          deep: "#A88A4E",
        },
        navy: "#0C1622",
        line: "#E5E0D8",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      maxWidth: {
        shell: "1440px",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.6s ease both",
        marquee: "marquee 32s linear infinite",
        "hotspot-ring": "hotspot-ring 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "hotspot-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(247, 244, 239, 0.55)" },
          "70%": { boxShadow: "0 0 0 12px rgba(247, 244, 239, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(247, 244, 239, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
