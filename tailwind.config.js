/** @type {import('tailwindcss').Config} */
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
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    
  },
 plugins: [
],
  darkMode: 'class'
}
