/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0c2955",
        "background-light": "#f6f7f8",
        "background-dark": "#111721",
        gold: "#D4AF37",
      },
      fontFamily: {
        display: ["Work Sans", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [aspectRatio],
};
