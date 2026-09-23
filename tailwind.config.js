/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: 'rgb(var(--c-app) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        border: {
          DEFAULT: 'rgb(var(--c-border) / <alpha-value>)',
          soft: 'rgb(var(--c-border-soft) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
          faint: 'rgb(var(--c-ink-faint) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          strong: 'rgb(var(--c-accent-strong) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--c-danger) / <alpha-value>)',
          soft: 'rgb(var(--c-danger-soft) / <alpha-value>)',
        },
        priority: {
          low: '#8B8880',
          medium: '#2563EB',
          high: '#D97706',
          urgent: '#DC2626',
        },
        status: {
          backlog: '#8B8880',
          todo: '#2563EB',
          progress: '#D97706',
          review: '#7C3AED',
          done: '#0D9488',
        },
      },
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        app: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(33, 31, 28, 0.04), 0 8px 24px rgba(33, 31, 28, 0.06)',
        pop: '0 4px 12px rgba(33, 31, 28, 0.10)',
      },
      maxWidth: {
        content: '1180px',
      },
      keyframes: {
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toastIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
