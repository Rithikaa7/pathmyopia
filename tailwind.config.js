/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F7FA',
        card: '#FFFFFF',
        sidebar: {
          DEFAULT: '#101C2C',
          hover: '#19283D',
          active: '#21334E',
          text: '#CBD5E1',
          textActive: '#FFFFFF',
          border: '#1E2F46',
        },
        primary: {
          DEFAULT: '#0F9F9A',
          hover: '#0D8B86',
          light: '#E6F6F5',
          dark: '#0A6E6A',
        },
        secondary: {
          DEFAULT: '#2B6CB0',
          hover: '#255C97',
          light: '#EBF3FA',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        clinical: {
          normal: '#10B981',
          mild: '#3B82F6',
          moderate: '#F59E0B',
          severe: '#EF4444',
          atrophy: '#8B5CF6',
          disc: '#10B981',
          lacquer: '#F59E0B',
          fuchs: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 1px 3px 0 rgba(16, 28, 44, 0.04), 0 2px 6px 0 rgba(16, 28, 44, 0.04)',
        hover: '0 4px 12px 0 rgba(16, 28, 44, 0.08)',
      }
    },
  },
  plugins: [],
}
