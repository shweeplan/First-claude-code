import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        papyrus: "#F4EBD9",
        sand: "#E8D5B0",
        sandstone: "#D4B483",
        brown: "#5A3A22",
        ink: "#2B1A0E",
        night: "#120B07",
        gold: "#C9973E",
        "gold-light": "#EBC77E",
        lapis: "#1E3A72",
        turquoise: "#2A9D96",
        carnelian: "#B2432D",
      },
      fontFamily: {
        display: ["'Cinzel Variable'", "Georgia", "serif"],
        sans: ["'Manrope Variable'", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
