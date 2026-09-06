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
        background: "#F7F5EF",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#1B1B17",
          soft: "#3A3A33",
        },
        muted: "#6B6A61",
        border: "#E3DFD3",
        brand: {
          DEFAULT: "#1C4632",
          dark: "#0F2E20",
          light: "#EAF0EB",
        },
        accent: {
          DEFAULT: "#BE7332",
          light: "#F3E4D2",
        },
        clay: {
          DEFAULT: "#A8492E",
          light: "#F4DDD3",
        },
        ochre: {
          DEFAULT: "#C08A1E",
          light: "#F5E7C8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
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
    },
  },
  plugins: [],
};

export default config;
