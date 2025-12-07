/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./scripts/*.js"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      screens: {
            'below-600': {'max': '599px'},
          },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],

};
