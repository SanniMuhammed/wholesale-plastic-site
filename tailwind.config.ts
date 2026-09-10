import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#131A22",
          soft: "#48515B",
        },
        muted: "#66717C",
        border: "#D5DBE0",
        brand: {
          DEFAULT: "#131921",
          dark: "#0B1116",
          light: "#EAEDED",
        },
        accent: {
          DEFAULT: "#FF9900",
          light: "#FFF3E0",
        },
        clay: {
          DEFAULT: "#A8492E",
          light: "#F4DDD3",
        },
        ochre: {
          DEFAULT: "#C98200",
          light: "#FFF0D6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "1240px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "14px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,27,23,0.06), 0 1px 1px rgba(27,27,23,0.04)",
        lifted: "0 12px 28px -12px rgba(27,27,23,0.22)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.3)" },
          "60%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        "grow-x": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "settle-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.4s ease",
        "grow-x": "grow-x 1s cubic-bezier(0.4,0,0.2,1) both",
        "settle-up": "settle-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
