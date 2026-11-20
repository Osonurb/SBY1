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
        obsidian: "#0B0E12",
        charcoal: "#12161D",
        paper: "#F4F1EA",
        crimson: "#9E2436",
        dandelion: "#E2A93B",
        weightcyan: "#29B6D1",
      },
    },
  },
  plugins: [],
};

export default config;
