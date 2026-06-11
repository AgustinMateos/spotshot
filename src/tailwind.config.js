/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",     // si tenés carpetas fuera de src
  ],
  theme: {
    extend: {
      fontFamily: {
        oxygen: ['var(--font-oxygen)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        'open-sans': ['var(--font-open-sans)', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}