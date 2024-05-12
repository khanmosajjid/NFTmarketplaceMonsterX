/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        themeYellow: "#DDF247",
      },
      fontFamily: {
        azeret: "Azeret Mono",
        manrope: "Manrope",
      },
      screens: {
        parity: "1200px",
        mmd: "992px"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
