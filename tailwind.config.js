/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#38bdf8', // Soft sky blue
          600: '#0284c7',
          900: '#0c4a6e',
        },
        success: '#7ED957', // Accent light green for TTS
        danger: '#E53935', // Review red
        bgSoft: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '15px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
      },
      spacing: {
        'mobile-safe': '16px',
        'card-gap': '12px',
      },
      borderRadius: {
        'card': '16px',
        'btn': '22px',
      },
      boxShadow: {
        'soft': '0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}