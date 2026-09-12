import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // accentStyles in lib/blog.ts holds gradient/chip class strings
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunny: {
          DEFAULT: "#1A7D3E",
          bright: "#116530",
          dark: "#09381A",
        },
        forest: {
          DEFAULT: "#116530",
          deep: "#09381A",
          light: "#1A7D3E",
          ink: "#2C3E35",
        },
        cream: "#FAF8F5",
        sage: "#E8F0EC",
        berry: "#B5179E",
        citrus: "#2F9E52",
        accent: {
          apple: "#9B2B19",
          lemon: "#E8C31E",
          orange: "#E46C0B",
          pineapple: "#ECB722",
          banana: "#D4AE59",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-xl": ["6rem", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(11, 102, 35, 0.15)",
        window:
          "0 50px 100px -20px rgba(8, 48, 26, 0.25), 0 30px 60px -30px rgba(8, 48, 26, 0.3)",
        lift: "0 20px 40px -16px rgba(8, 48, 26, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
        "pop-in": "pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
