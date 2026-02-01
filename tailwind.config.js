/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          pending: 'var(--color-neo-pending)',
          progress: 'var(--color-neo-progress)',
          done: 'var(--color-neo-done)',
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-neo': 'pulse-neo 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-first': 'gradient-moveVertical 30s ease infinite',
        'gradient-second': 'gradient-moveInCircle 20s reverse infinite',
        'gradient-third': 'gradient-moveInCircle 40s linear infinite',
        'gradient-fourth': 'gradient-moveHorizontal 40s ease infinite',
        'gradient-fifth': 'gradient-moveInCircle 20s ease infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'pulse-neo': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-moveHorizontal': {
          '0%': { transform: 'translateX(-50%) translateY(-10%)' },
          '50%': { transform: 'translateX(50%) translateY(10%)' },
          '100%': { transform: 'translateX(-50%) translateY(-10%)' },
        },
        'gradient-moveInCircle': {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'gradient-moveVertical': {
          '0%': { transform: 'translateY(-50%)' },
          '50%': { transform: 'translateY(50%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
