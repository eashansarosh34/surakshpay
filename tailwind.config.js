/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#0F172A',
        primary: '#10B981',
        'primary-dark': '#059669',
        'p2pm-green': '#10B981',
        'p2pm-amber': '#F59E0B',
        'p2pm-red': '#EF4444',
      },
    },
  },
  plugins: [],
};
