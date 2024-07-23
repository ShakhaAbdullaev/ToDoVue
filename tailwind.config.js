/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true
      },
      colors: {
        'glass-white': 'rgba(255, 255, 255, 0.2)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

