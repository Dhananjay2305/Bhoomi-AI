/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        alt: ['Manrope', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      colors: {
        bhoomi: {
          // Deep Forest & Emerald greens (Premium startup greens)
          50: '#F2FBF6',
          100: '#E0F6E9',
          200: '#B9E9CB',
          300: '#83D7A4',
          400: '#56BF7F',
          500: '#2FA45C',
          600: '#238449',
          700: '#1D683A',
          800: '#185330',
          900: '#144428',
          950: '#0B2615',
        },
        earth: {
          50: '#F9F8F6',
          100: '#F2EFEA',
          200: '#E2DBCE',
          300: '#CEC0AB',
          400: '#B8A287',
          500: '#A48666',
          600: '#947255',
          700: '#7B5E49',
          800: '#644E3D',
          900: '#524033',
        },
        beige: {
          light: '#FAF9F6',
          DEFAULT: '#F5F5DC',
          dark: '#E8E5C8',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neon-green': '0 0 20px rgba(47, 164, 92, 0.4)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
