/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e1a',
          800: '#0a1628',
          700: '#111d33',
          600: '#1a2740',
          500: '#243350',
        },
        accent: {
          DEFAULT: '#1890ff',
          light: '#40a9ff',
          dark: '#096dd9',
        },
        danger: '#ff4d4f',
        success: '#52c41a',
        warning: '#faad14',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
