/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bluish_grey: {
          500: "#2D3748"
        },
        black_accent: {
          500: "#07080E"
        }
      },
    },
  },
  plugins: [],
}
