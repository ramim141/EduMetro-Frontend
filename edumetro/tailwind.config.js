/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#7dcbfc',
          400: '#38b0f8',
          500: '#0e96ea',
          600: '#0078cc',
          700: '#0060a6',
          800: '#065288',
          900: '#0a4571',
          950: '#062b4a',
        },
      },
      animation: {
        'shine': 'shine 3s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '50%, 100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

