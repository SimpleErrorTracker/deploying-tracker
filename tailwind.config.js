/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'bebas-bold': ['BebasNeueProBold', 'sans-serif'],
        'bebas-middle': ['BebasNeueProMiddle', 'sans-serif'],
        'bebas-regular': ['BebasNeueProRegular', 'sans-serif'],
        consolas: ['Consolas', 'sans-serif'],
        bebas: ['Bebas Neue Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
