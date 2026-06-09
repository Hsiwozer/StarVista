import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#02030a",
          900: "#070b18",
          850: "#0b1024",
          800: "#111833",
        },
        nebula: {
          500: "#8d6dff",
          400: "#b59cff",
          300: "#d9ccff",
        },
        galaxy: {
          500: "#3aa7ff",
          400: "#7fc7ff",
        },
        starlight: "#f6f8ff",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', '"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(141, 109, 255, 0.24)",
        "glow-blue": "0 0 42px rgba(58, 167, 255, 0.2)",
      },
      backgroundImage: {
        "radial-space":
          "radial-gradient(circle at 70% 18%, rgba(141,109,255,0.34), transparent 30%), radial-gradient(circle at 25% 80%, rgba(58,167,255,0.18), transparent 34%)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        meteor: {
          "0%": { opacity: "0", transform: "translate3d(-10vw, -10vh, 0)" },
          "8%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate3d(120vw, 70vh, 0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "float-in": "floatIn 900ms ease-out both",
        meteor: "meteor 7s linear infinite",
        shimmer: "shimmer 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
