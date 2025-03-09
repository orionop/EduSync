/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'desktop': '1280px',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        marathi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      backdropBlur: {
        'glass': 'blur(10px)',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(17, 24, 39, 0.7)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};