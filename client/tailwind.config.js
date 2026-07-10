/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        desk: {
          DEFAULT: "#0F1C1B",
          elevated: "#162624",
          line: "#2A3B37",
        },
        paper: {
          DEFAULT: "#F6F3EA",
          dim: "#EAE6D8",
          line: "#D8D2BF",
        },
        ink: "#171410",
        muted: "#7C8B84",
        stamp: {
          amber: "#E3A73B",
          green: "#3F7D57",
          rust: "#B4472F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        paper: "0 1px 0 rgba(0,0,0,0.05), 0 12px 30px -12px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
