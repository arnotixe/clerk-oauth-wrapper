/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        screen: "calc(100dvh)", // Fixes vertical scroll on some mobile devices
        ...defaultTheme.height,
      },
      boxShadow: {
        centerbox: "rgba(0, 0, 0, 0.16) 0px 24px 48px",
      },
    },
  },
  plugins: [],
};
