/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  safelist: [
    'rounded-full',
    'rounded-xl',
    'shadow-sm',
    'shadow-xl',
    'dark:bg-gray-800',
    'dark:border-gray-700',
  ],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Tailwind's blue-500
          light: '#60A5FA',   // blue-400
          dark: '#2563EB',    // blue-600
        },
        dark: {
          DEFAULT: '#1f2937', // gray-800
        },
      },
    },
  },
  plugins: [scrollbarHide],
  darkMode: 'class',
};
