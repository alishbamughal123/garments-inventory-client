/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Nordic Prowear logo blue (navy), 600/700 match the colours already used on the login page
        brand: {
          50: "#eef4fb",
          100: "#d9e6f5",
          200: "#b6cfeb",
          300: "#85afdc",
          400: "#4f89c8",
          500: "#2c6aae",
          600: "#07599a",
          700: "#0a3866",
          800: "#0a2c52",
          900: "#081f3b",
          950: "#05142a",
        },
      },
    },
  },

  plugins: [],
};
