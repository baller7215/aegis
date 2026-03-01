/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./content.js", "./popup.html", "./popup.js", "./src/**/*.css"],
  safelist: [
    "aegis-risk-low",
    "aegis-risk-medium",
    "aegis-risk-high",
    "aegis-meter-confidence",
    "aegis-meter-evidence",
    "aegis-meter-value--low",
    "aegis-meter-value--medium",
    "aegis-meter-value--high",
    "aegis-meter-bar--low",
    "aegis-meter-bar--medium",
    "aegis-meter-bar--high",
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
        "aegis-fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "aegis-bar-fill": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "aegis-expand": "aegis-expand 0.25s ease",
        "aegis-expand-slow": "aegis-expand 0.3s ease",
        "aegis-fade-up": "aegis-fade-up 0.35s ease forwards",
        "aegis-bar-fill": "aegis-bar-fill 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};
