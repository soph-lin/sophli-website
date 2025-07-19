import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        conveyor: {
          "0%": { "stroke-dashoffset": "200" },
          "50%": { "stroke-dashoffset": "0" },
          "75%": { "stroke-dashoffset": "5" },
          "80%": { "stroke-dashoffset": "-5" },
          "100%": { "stroke-dashoffset": "0" },
        },
        drop: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        pull: {
          "0%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-5px)" },
          "50%": { transform: "translateY(5px)" },
          "100%": { transform: "translateY(0)" },
        },
        "star-swirl": {
          ["0%"]: { 
            transform: "translate(15%, 85%) scale(0.5) rotate(0deg)",
          },
          ["12.5%"]: {
            transform: "translate(85%, 75%) scale(0.7) rotate(135deg)",
          },
          ["25%"]: {
            transform: "translate(85%, 25%) scale(0.8) rotate(270deg)",
          },
          ["37.5%"]: {
            transform: "translate(15%, 15%) scale(0.9) rotate(405deg)",
          },
          ["50%"]: {
            transform: "translate(15%, 65%) scale(1.0) rotate(540deg)",
          },
          ["62.5%"]: {
            transform: "translate(75%, 65%) scale(1.1) rotate(675deg)",
          },
          ["75%"]: {
            transform: "translate(75%, 35%) scale(1.2) rotate(810deg)",
          },
          ["87.5%"]: {
            transform: "translate(35%, 35%) scale(1.3) rotate(945deg)",
          },
          ["100%"]: { 
            transform: "translate(50%, 50%) scale(1.5) rotate(1080deg)",
          }
        },
        "star-pulse": {
          "0%, 100%": { 
            opacity: "0.8",
            transform: "scale(1)",
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.2)",
          }
        },
        "star-explode": {
          "0%": { 
            transform: "translate(-50%, -50%) scale(1.5)",
            opacity: "1"
          },
          "100%": { 
            transform: "translate(-50%, -50%) scale(0)",
            opacity: "0"
          }
        },
        "particle": {
          "0%": { 
            transform: "translate(-50%, -50%) rotate(var(--particle-angle)) translate(0, 0)",
            opacity: "1"
          },
          "100%": { 
            transform: "translate(-50%, -50%) rotate(var(--particle-angle)) translate(var(--particle-drift-x3), var(--particle-distance-3))",
            opacity: "0"
          }
        },
        "title-drop": {
          "0%": { 
            transform: "translateY(-50px)", 
            opacity: "0" 
          },
          "100%": { 
            transform: "translateY(0)", 
            opacity: "1" 
          }
        },
        "title-float": {
          "0%, 100%": {
            transform: "translate(calc(var(--float-x, 0) * 0.5px), calc(var(--float-y, 0) * 0.5px)) rotate(calc(var(--float-r, 0) * 0.5deg))"
          },
          "50%": {
            transform: "translate(calc(var(--float-x, 0) * -0.5px), calc(var(--float-y, 0) * -0.5px)) rotate(calc(var(--float-r, 0) * -0.5deg))"
          }
        },
        "star-appear": {
          "0%": { 
            opacity: "0",
            transform: "scale(0)",
          },
          "100%": { 
            opacity: "0.8",
            transform: "scale(1)",
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        "cord-pull": "pull 0.2s ease-in forwards",
        "cord-drop": "drop 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards",
        'star-swirl': 'star-swirl 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'star-pulse': 'star-pulse 3s ease-in-out infinite',
        'star-explode': 'star-explode 0.5s ease-in-out forwards',
        'particle': 'particle 1s ease-out forwards',
        'title-drop': 'title-drop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'title-float': 'title-float 8s ease-in-out infinite',
        'star-appear': 'star-appear 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('theme-dark', '[theme="dark"] &')
    }),
  ],
} satisfies Config;