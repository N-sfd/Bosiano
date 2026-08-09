import type { Config } from "tailwindcss";

/**
 * Bosiano design tokens — light heritage surfaces + gold CTAs.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Headings #2A211B · Body #5C534D */
        ink: {
          DEFAULT: "#2A211B",
          soft: "#5C534D",
          muted: "#8A8178",
        },
        /* Page #F7F4EF · Section #FCFAF7 · Cards #FFFFFF · Hero end #EFE8DD */
        canvas: {
          DEFAULT: "#F7F4EF",
          raised: "#FCFAF7",
          card: "#FFFFFF",
          sunk: "#EFE8DD",
        },
        void: "#000000",
        /* Gold accent #C5A059 · Hover #B98A35 */
        gold: {
          DEFAULT: "#C5A059",
          soft: "#D4B57A",
          deep: "#B98A35",
        },
        bronze: {
          DEFAULT: "#A65E2E",
          deep: "#5E3A1A",
        },
        italy: {
          green: "#008C45",
          white: "#F4F5F0",
          red: "#CD212A",
        },
        navy: "#0C1622",
        /* Thin borders #E5D6B3 */
        line: "#E5D6B3",
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
      backgroundImage: {
        "hero-wash": "linear-gradient(180deg, #F7F4EF 0%, #EFE8DD 100%)",
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
          "0%": { boxShadow: "0 0 0 0 rgba(197, 160, 89, 0.4)" },
          "70%": { boxShadow: "0 0 0 12px rgba(197, 160, 89, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(197, 160, 89, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
