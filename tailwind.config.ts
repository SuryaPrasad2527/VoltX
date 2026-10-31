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
        volt: {
          bg: "#080B09",
          card: "#111713",
          cardHover: "#16201a",
          dark: "#0d120f",
          border: "#1f2a22",
          borderGlow: "rgba(183, 255, 50, 0.3)",
          accent: "#B7FF32",
          accentHover: "#9ee620",
          secondary: "#79D900",
          text: "#FFFFFF",
          muted: "#A0AAA2",
          dim: "#5c6b61",
        },
      },
      boxShadow: {
        "volt-glow": "0 0 25px -5px rgba(183, 255, 50, 0.35)",
        "volt-glow-lg": "0 0 40px -5px rgba(183, 255, 50, 0.45)",
        "volt-card": "0 8px 30px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "volt-radial": "radial-gradient(circle at center, rgba(183, 255, 50, 0.15) 0%, transparent 70%)",
        "volt-gradient": "linear-gradient(135deg, #B7FF32 0%, #79D900 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
