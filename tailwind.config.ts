import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "holiday-red": "#d42426",
        "holiday-green": "#2f5233",
        "holiday-gold": "#f1c40f",
      },
    },
  },
  plugins: [],
} satisfies Config;
