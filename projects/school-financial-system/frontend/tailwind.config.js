/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#065f46", // Emerald-800 for actions
          secondary: "#312e81", // Indigo-900 for secondary
          neutral: "#1c1917", // Stone-900 for text
          background: "#fafaf9", // Warm white
        },
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"], // Geometric for UI
        mono: ['"JetBrains Mono"', "monospace"], // Tabular for alignment
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(28, 25, 23, 1)", // Deep diffuse shadow alternative
      },
    },
  },
  plugins: [],
};
