/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./content.js", "./popup.html", "./popup.js", "./src/**/*.css"],
  safelist: [
    "aegis-risk-low",
    "aegis-risk-medium",
    "aegis-risk-high",
    "aegis-meter-confidence",
    "aegis-meter-evidence",
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Söhne",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "aegis-expand": {
          from: {
            opacity: "0",
            maxHeight: "0",
            paddingTop: "0",
            paddingBottom: "0",
          },
          to: { opacity: "1", maxHeight: "600px" },
        },
      },
      animation: {
        "aegis-expand": "aegis-expand 0.25s ease",
        "aegis-expand-slow": "aegis-expand 0.3s ease",
      },
    },
  },
  plugins: [],
};
