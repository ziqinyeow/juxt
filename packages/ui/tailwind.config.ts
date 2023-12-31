// import type { Config } from "tailwindcss";
// import sharedConfig from "tailwind/tailwind.config";

// const config: Pick<Config, "presets"> = {
//   presets: [sharedConfig],
// };
// export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./layout/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      cursor: {
        fancy: "url(/cursor/unfold.svg) 8 8, auto",
        scissor: "url(/cursor/scissor.svg) 8 8, auto",
        "left-bracket": "url(/cursor/left-bracket.svg) 4 8, auto",
        "right-bracket": "url(/cursor/right-bracket.svg) 14 8, auto",
      },
      backgroundImage: {
        voice: "url('/voice.svg')",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        light: {
          100: "#FFFFFF",
          200: "#FBFBFA",
          300: "#F1F0F0",
          400: "rgb(156 163 175 / 0.3)",
          500: "#A9A8A6",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          100: "#FFFFFF",
          200: "#9ca3af",
          300: "#4b5563",
          400: "#211F21",
          500: "#131519",
          600: "#18151B",
          700: "#000000",
          800: "#0D0B0D",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          100: "#5D46F3",
          200: "#2BEBC8",
        },
        element: {
          1: "#FE409C",
          2: "#FF9D00",
          3: "#01CFFE",
          4: "#612AFE",
          5: "#9DFA31",
          6: "#FF2B61",
          7: "#0065F4",
          8: "#FFBE1B",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
