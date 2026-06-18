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
        inter: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          light: 'rgb(var(--primary) / 0.1)',
          dark: 'rgb(var(--primary) / 0.9)',
        },
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--accent) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        card: 'var(--bg-card)',
        divider: 'var(--border)',
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        }
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(15, 23, 42, 0.02)',
        'premium': '0 12px 24px rgba(15, 23, 42, 0.06), 0 4px 8px rgba(15, 23, 42, 0.03)',
        'xl': '0 20px 40px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
