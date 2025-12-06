/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./scripts/*.js"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],

};
