/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-background": "#F5F5F3",
        "card-surface": "#FFFFFF",
        "text-border": "#1C1917",
        "structural-navy": "#0A0A2A",
        "action-mint": "#00E98F",
        "alert-crimson": "#FF3366",
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
