/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#11998e', // Teal/emerald (matches footer accent)
        dark: '#160F29',
        'footer-gradient-from': '#11998e', // Left side of footer gradient
        'footer-gradient-to': '#38ef7d',   // Right side of footer gradient
        // Optionally, add more accent colors for buttons, highlights, etc.
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [],
};
