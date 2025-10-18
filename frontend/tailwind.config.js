/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emotion-red': '#ef4444',
        'emotion-blue': '#3b82f6', 
        'emotion-green': '#10b981',
        'emotion-orange': '#f97316',
        'emotion-gray': '#6b7280'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-recording': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
